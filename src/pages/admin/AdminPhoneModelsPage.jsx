import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { phoneModelService } from '../../services/phoneModelService';
import { brandService } from '../../services/brandService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/feedback/Alert';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { Smartphone, PlusCircle, Edit2, Trash2, Search, Sparkles } from 'lucide-react';

export function AdminPhoneModelsPage() {
  const { t } = useLanguage();

  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [brand, setBrand] = useState('Apple');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [releaseYear, setReleaseYear] = useState('2024');
  const [popular, setPopular] = useState(true);
  const [modelToDelete, setModelToDelete] = useState(null);

  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: modelList }, { data: brandList }] = await Promise.all([
        phoneModelService.getPhoneModels(),
        brandService.getBrands()
      ]);
      setModels(modelList || []);
      setBrands(brandList || []);
    } catch (err) {
      console.error('Failed to load phone models:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingModel(null);
    setBrand('Apple');
    setName('');
    setSlug('');
    setReleaseYear(String(new Date().getFullYear()));
    setPopular(true);
    setIsModalOpen(true);
  };

  const openEditModal = (m) => {
    setEditingModel(m);
    setBrand(m.brand || 'Apple');
    setName(m.name);
    setSlug(m.id || m.slug || '');
    setReleaseYear(String(m.releaseYear || new Date().getFullYear()));
    setPopular(!!m.popular);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    const modelSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingModel) {
      await phoneModelService.updatePhoneModel(editingModel.id, {
        brand,
        name,
        slug: modelSlug,
        releaseYear: Number(releaseYear),
        popular
      });
      setFeedbackMsg(t('admin.model_updated_success'));
    } else {
      await phoneModelService.createPhoneModel({
        brand,
        name,
        slug: modelSlug,
        releaseYear: Number(releaseYear),
        popular
      });
      setFeedbackMsg(t('admin.model_created_success'));
    }

    setSaving(false);
    setIsModalOpen(false);
    setTimeout(() => setFeedbackMsg(''), 3000);
    await loadData();
  };

  const handleDeleteConfirm = async () => {
    if (!modelToDelete) return;
    await phoneModelService.deletePhoneModel(modelToDelete.id);
    setModelToDelete(null);
    setFeedbackMsg(t('admin.model_deleted_success'));
    setTimeout(() => setFeedbackMsg(''), 3000);
    await loadData();
  };

  const filteredModels = models.filter((m) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!m.name.toLowerCase().includes(q) && !m.brand.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedBrand !== 'all' && m.brand?.toLowerCase() !== selectedBrand.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-[#FF7A00]" />
            {t('admin.phone_models_title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('admin.phone_models_subtitle')} ({filteredModels.length})
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={PlusCircle}
          onClick={openCreateModal}
          className="font-bold shadow-lg shadow-orange-500/20"
        >
          {t('admin.add_model_btn')}
        </Button>
      </div>

      {feedbackMsg && (
        <Alert variant="success" title={t('common.success')}>
          {feedbackMsg}
        </Alert>
      )}

      {/* Search & Filter */}
      <Card className="p-4 sm:p-5 border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            placeholder={t('admin.search_models_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />

          <Select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            options={[
              { value: 'all', label: t('admin.all_brands_filter') },
              ...brands.map((b) => ({ value: b.name, label: b.name }))
            ]}
          />
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <Card className="p-0 border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">{t('admin.brand_col')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.model_name_col')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.slug_label')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.release_year_col')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.badges_col')}</th>
                  <th className="py-3.5 px-4 font-bold text-right">{t('admin.actions_col')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredModels.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {m.brand}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {m.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {m.id}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {m.releaseYear || '—'}
                    </td>
                    <td className="py-3 px-4">
                      {m.popular && (
                        <Badge variant="warning" size="sm" icon={Sparkles}>
                          POPULAR
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          icon={Edit2}
                          onClick={() => openEditModal(m)}
                          className="text-slate-600 hover:text-[#FF7A00]"
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          icon={Trash2}
                          onClick={() => setModelToDelete(m)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingModel ? t('admin.edit_model_title') : t('admin.new_model_title')}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('admin.brand_col')} *
            </label>
            <Select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              options={brands.map((b) => ({ value: b.name, label: b.name }))}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('admin.model_name_col')} *
            </label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingModel && !slug) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }
              }}
              placeholder="iPhone 16 Pro"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('admin.slug_label')}
            </label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="iphone-16-pro"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('admin.release_year_col')}
              </label>
              <Input
                type="number"
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
                placeholder="2024"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={popular}
                  onChange={(e) => setPopular(e.target.checked)}
                  className="rounded border-slate-300 text-[#FF7A00] focus:ring-[#FF7A00]"
                />
                <span className="font-bold text-slate-700 dark:text-slate-300">{t('admin.popular_flag')}</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={saving}>
              {saving ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!modelToDelete}
        onClose={() => setModelToDelete(null)}
        title={t('admin.confirm_delete_title')}
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            {t('admin.confirm_delete_model_msg')} <strong>{modelToDelete?.name}</strong>?
          </p>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" size="sm" onClick={() => setModelToDelete(null)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t('admin.delete_btn')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
