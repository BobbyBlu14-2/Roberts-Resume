# Security Specification — Robert Philizaire Jr. / Blu Marketing Group Portal

## 1. Data Invariants
1. **Profile Isolation**: A `UserProfile` document at `/users/{userId}` can only be read or created/updated by `request.auth.uid == userId` (or an explicit admin). Listing `/users` is strictly denied to prevent PII enumeration.
2. **No Self-Assigned Roles**: On `UserProfile` creation, `role` MUST equal `'member'`. Non-admins cannot mutate `role` or `uid` or `createdAt` after creation.
3. **Campaign Ownership & Master Gate**: A `CampaignMetric` at `/users/{userId}/campaigns/{campaignId}` cannot exist without its parent `/users/{userId}` document existing, and `ownerId` MUST match both `userId` and `request.auth.uid`.
4. **Terminal State Locking**: Once a `CampaignMetric` reaches `status == 'Completed'` (or a `ContactInquiry` reaches `status == 'Archived'`), non-admin writes cannot modify it.
5. **Verified Email Requirement**: All writes across all collections require `request.auth.token.email_verified == true`.
6. **Strict Timestamp Integrity**: `createdAt` and `updatedAt` MUST match `request.time` on create, and `updatedAt` MUST match `request.time` on update while `createdAt` remains immutable.

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated Profile Read**: Anonymous `get` on `/users/userA` -> Denied (`isSignedIn()`).
2. **Cross-User Profile Read (PII Leak)**: `userB` `get` on `/users/userA` -> Denied (`isOwner(userId)`).
3. **Directory Enumeration (List Users)**: `userA` `list` on `/users` -> Denied (`allow list: if false`).
4. **Privilege Escalation on Create**: `userA` `create` on `/users/userA` with `role: "admin"` -> Denied (`incoming().role == 'member'`).
5. **Role Mutation on Update**: `userA` `update` on `/users/userA` changing `role` to `"admin"` -> Denied (`incoming().role == existing().role`).
6. **Shadow / Ghost Field Injection**: `userA` `create` on `/users/userA/campaigns/c1` with extra field `isFeatured: true` -> Denied (`data.keys().hasOnly(...)`).
7. **Identity Spoofing on Campaign**: `userA` `create` on `/users/userA/campaigns/c1` with `ownerId: "userB"` -> Denied (`data.ownerId == request.auth.uid`).
8. **ID Poisoning**: `userA` `create` on `/users/userA/campaigns/bad$id!with*chars` -> Denied (`isValidId(campaignId)`).
9. **Client Timestamp Forgery**: `userA` `create` on `/users/userA/campaigns/c1` with past `createdAt` -> Denied (`incoming().createdAt == request.time`).
10. **Terminal State Bypass**: `userA` `update` on a `Completed` campaign changing `revenue` -> Denied (`existing().status != 'Completed'`).
11. **Value / Type Poisoning**: `userA` `create` on `/users/userA/campaigns/c1` with `impressions: -500` or `title` > 80 chars -> Denied (`isValidCampaignMetric`).
12. **Unverified Email Inquiry Spoof**: User with `email_verified: false` (even matching admin email) creating `/inquiries/inq1` or reading another user's inquiry -> Denied (`isEmailVerified()` and `resource.data.ownerId == request.auth.uid`).
