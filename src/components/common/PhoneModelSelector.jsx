import React, { useState, useEffect } from 'react';
import { usePhoneModel } from '../../context/PhoneModelContext';
import { useLanguage } from '../../hooks/useLanguage';
import { phoneModelService } from '../../services/phoneModelService';
import { Modal } from './Modal';
import { Button } from './Button';
import { Smartphone, Check, Search, X, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export function PhoneModelSelector({
  variant = 'badge',
  className = '',
  isOpen: externalIsOpen,
  onClose: externalOnClose
}) {
  const { selectedModel, selectedModelId, selectModel, clearModel, hasSelectedModel } = usePhoneModel();
  const { t } = useLanguage();

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isModalOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleOpenModal = () => {
    setInternalIsOpen(true);
  };

  const handleCloseModal = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    async function loadData() {
      const { data: modelsData } = await phoneModelService.getPhoneModels({
        search: searchQuery,
        brand: selectedBrand
      });
      const { data: brandsData } = await phoneModelService.getBrands();
      setModels(modelsData || []);
      setBrands(brandsData || []);
    }
    loadData();
  }, [searchQuery, selectedBrand]);

  const handleSelect = (modelId) => {
    if (selectedModelId === modelId) {
      clearModel();
      handleCloseModal();
      return;
    }
    selectModel(modelId);
    handleCloseModal();
  };

  const handleClear = () => {
    clearModel();
    handleCloseModal();
  };

  return (
    <>
      {/* Trigger button */}
      {variant === 'search' && (
        <div className={cn("relative flex items-center shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-800/80 self-stretch", className)}>
          {hasSelectedModel ? (
            <div className="flex items-center gap-1.5 pl-3.5 pr-2 py-2">
              <button
                type="button"
                onClick={handleOpenModal}
                className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer text-left"
                title={t('phone_model.change_model')}
              >
                <Smartphone className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span className="truncate max-w-[120px] xl:max-w-[155px]">
                  {selectedModel?.name}
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-1 rounded-md text-neutral-400 hover:text-rose-500 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 transition-colors cursor-pointer"
                title={t('phone_model.clear_model')}
                aria-label={t('phone_model.clear_model')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenModal}
              className="flex items-center gap-2 pl-3.5 pr-3 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-neutral-400" />
              <span className="whitespace-nowrap">{t('phone_model.my_model')}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-0.5" />
            </button>
          )}
        </div>
      )}

      {variant === 'header' && (
        <button
          type="button"
          onClick={handleOpenModal}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
            hasSelectedModel
              ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-950/40 dark:border-brand-900 dark:text-brand-400'
              : 'bg-neutral-100 hover:bg-neutral-200/80 border-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300',
            className
          )}
        >
          <Smartphone className={cn('w-4 h-4', hasSelectedModel ? 'text-brand-600 dark:text-brand-400' : 'text-neutral-500')} />
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
              {t('phone_model.my_model')}
            </span>
            <span className="truncate max-w-[130px] font-bold">
              {selectedModel ? selectedModel.name : t('phone_model.select_device')}
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 ml-0.5" />
        </button>
      )}

      {variant === 'badge' && (
        <button
          type="button"
          onClick={handleOpenModal}
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs max-w-full overflow-hidden',
            hasSelectedModel
              ? 'bg-brand-600 text-white'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-brand-300',
            className
          )}
        >
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate max-w-[140px] sm:max-w-none">{selectedModel ? selectedModel.name : t('phone_model.select_device')}</span>
          {hasSelectedModel && <Check className="w-3.5 h-3.5 shrink-0" />}
        </button>
      )}

      {variant === 'banner' && (
        <div
          className={cn(
            'flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 rounded-xl border',
            hasSelectedModel
              ? 'bg-brand-50/80 border-brand-200 dark:bg-brand-950/20 dark:border-brand-900/40'
              : 'bg-neutral-50 border-neutral-200 dark:bg-neutral-800/60 dark:border-neutral-700',
            className
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {hasSelectedModel ? t('phone_model.showing_compatible_for') : t('phone_model.select_prompt')}
              </p>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                {hasSelectedModel ? selectedModel.name : t('phone_model.select_device')}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
            {hasSelectedModel && (
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-neutral-500">
                <X className="w-3.5 h-3.5 mr-1" />
                {t('phone_model.clear_model')}
              </Button>
            )}
            <Button
              variant={hasSelectedModel ? 'outline' : 'primary'}
              size="sm"
              onClick={handleOpenModal}
              className="w-full sm:w-auto"
            >
              {hasSelectedModel ? t('phone_model.change_model') : t('phone_model.select_device')}
            </Button>
          </div>
        </div>
      )}

      {/* Model Selection Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={t('phone_model.select_device')}
        maxWidth="max-w-xl"
        contentClassName="p-4 sm:p-5 overflow-hidden flex flex-col max-h-[82vh]"
      >
        <div className="flex flex-col gap-3.5 flex-1 min-h-0">
          {/* Search Box */}
          <div className="relative shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('phone_model.search_model_placeholder')}
              className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer"
                aria-label={t('catalog.clear_filters')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Brand Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
            <button
              type="button"
              onClick={() => setSelectedBrand('all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer',
                selectedBrand === 'all'
                  ? 'bg-brand-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              )}
            >
              {t('phone_model.all_models')}
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrand(brand)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer',
                  selectedBrand === brand
                    ? 'bg-brand-600 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                )}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Active Model Indicator with Direct Clear Button */}
          {hasSelectedModel && (
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 shrink-0">
              <div className="flex items-center gap-2 text-xs">
                <Smartphone className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-300">
                  {t('phone_model.showing_compatible_for')}{' '}
                  <strong className="text-neutral-900 dark:text-white font-bold">{selectedModel?.name}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                title={t('phone_model.clear_model')}
              >
                <X className="w-3.5 h-3.5" />
                <span>{t('phone_model.clear_model')}</span>
              </button>
            </div>
          )}

          {/* Models Grid - ONLY this element scrolls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 min-h-[180px] max-h-[340px] overflow-y-auto pr-1">
            {models.length === 0 ? (
              <div className="col-span-2 py-8 text-center text-neutral-400 text-sm">
                {t('phone_model.not_found')}
              </div>
            ) : (
              models.map((model) => {
                const isSelected = selectedModelId === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => handleSelect(model.id)}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer group',
                      isSelected
                        ? 'bg-brand-50/90 border-brand-500 text-brand-600 dark:bg-brand-950/40 ring-1 ring-brand-500/30 dark:text-brand-400'
                        : 'bg-white dark:bg-neutral-800/80 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-brand-300 hover:bg-brand-50/30'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Smartphone className={cn('w-4 h-4', isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-neutral-400')} />
                      <div>
                        <span className="font-bold">{model.name}</span>
                        <span className="block text-[10px] text-neutral-400 font-normal">
                          {model.brand} • {model.releaseYear}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900/60 group-hover:inline hidden">
                          {t('phone_model.clear_model')}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Actions (Sticky, always visible) */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
            {hasSelectedModel ? (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t('phone_model.clear_model')}</span>
              </button>
            ) : (
              <span className="text-xs text-slate-400">{models.length} {t('phone_model.available_models_count')}</span>
            )}
            <Button variant="secondary" size="sm" onClick={handleCloseModal}>
              {t('common.close')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
