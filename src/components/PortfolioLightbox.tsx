import { useState, useEffect } from 'react';
import { X, ArrowUpRight, Check } from 'lucide-react';
import type { CaseStudy } from '../types/app';
import { ResilientImage } from './ResilientImage';

interface PortfolioLightboxProps {
  study: CaseStudy | null;
  initialAssetId?: string | null;
  onClose: () => void;
  onInquire: (discipline: string) => void;
}

export function PortfolioLightbox({
  study,
  initialAssetId,
  onClose,
  onInquire,
}: PortfolioLightboxProps) {
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);

  useEffect(() => {
    if (!study) return;
    if (initialAssetId && study.gallery) {
      const idx = study.gallery.findIndex((g) => g.id === initialAssetId);
      setActiveAssetIndex(idx >= 0 ? idx : 0);
    } else {
      setActiveAssetIndex(0);
    }
  }, [study, initialAssetId]);

  useEffect(() => {
    if (!study) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [study, onClose]);

  if (!study) return null;

  const hasGallery = Boolean(study.gallery && study.gallery.length > 0);
  const currentGalleryAsset = hasGallery ? study.gallery![activeAssetIndex] : null;
  const activeImageUrl = currentGalleryAsset ? currentGalleryAsset.imageUrl : study.imageUrl;
  const activeTitle = currentGalleryAsset ? currentGalleryAsset.title : study.title;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-3" />
        <div
          className={`relative w-full overflow-hidden sm:rounded-t-2xl ${
            hasGallery
              ? 'h-80 sm:h-[420px] bg-slate-950 flex items-center justify-center'
              : 'aspect-[16/9] bg-slate-100 dark:bg-slate-800'
          }`}
        >
          <ResilientImage
            src={activeImageUrl}
            alt={activeTitle}
            title={activeTitle}
            className={
              hasGallery ? 'max-h-full w-auto object-contain' : 'w-full h-full object-cover'
            }
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close case study"
            className="absolute top-3 right-3 min-h-[44px] min-w-[44px] rounded-full bg-slate-950/75 text-white hover:bg-slate-950 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {hasGallery && study.gallery && (
            <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                  {currentGalleryAsset?.format}
                </p>
                <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                  {activeAssetIndex + 1} / {study.gallery.length}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {currentGalleryAsset?.caption}
              </p>
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {study.gallery.map((asset, idx) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setActiveAssetIndex(idx)}
                    className={`rounded-xl overflow-hidden border p-1 transition-colors text-left ${
                      idx === activeAssetIndex
                        ? 'border-blue-700 dark:border-blue-400 bg-blue-50/40 dark:bg-blue-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="h-16 w-full overflow-hidden rounded-lg bg-slate-950 flex items-center justify-center">
                      <ResilientImage
                        src={asset.imageUrl}
                        alt={asset.title}
                        title={asset.title}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <p className="text-[11px] font-medium text-slate-700 dark:text-slate-200 truncate mt-1.5 px-1">
                      {asset.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{study.client}</span>
              <span aria-hidden="true">·</span>
              <span>{study.discipline}</span>
              <span aria-hidden="true">·</span>
              <span>{study.year}</span>
            </div>
            <h3
              id="case-study-modal-title"
              className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
            >
              {study.title}
            </h3>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Outcome: {study.outcomeMetric}
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {study.details}
          </p>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
            <h4 className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 mb-3">
              Key Deliverables
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {study.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-200"
                >
                  <Check className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onInquire(study.title);
              }}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              Start Similar Project
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
