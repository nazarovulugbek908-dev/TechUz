import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { brandService } from '../../services/brandService';
import { productService } from '../../services/productService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Alert } from '../../components/feedback/Alert';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { Building2, PlusCircle, Edit2, Trash2 } from 'lucide-react';

export function AdminBrandsPage() {
  const { t } = useLanguage();

  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brandToDelete, setBrandToDelete] = useState(null);

  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: brandList }, { data: prodList }] = await Promise.all([
        brandService.getBrands(),
        productService.getProducts()
      ]);
      setBrands(brandList || []);
      setProducts(prodList || []);
    } catch (err) {
      console.error('Failed to load brands:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingBrand(null);
    setName('');
    setSlug('');
    setIsModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBrand(b);
    setName(b.name);
    setSlug(b.slug || b.id || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    const brandSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingBrand) {
      await brandService.updateBrand(editingBrand.id || editingBrand.slug, {
        name,
        slug: brandSlug
      });
      setFeedbackMsg(t('admin.brand_updated_success'));
    } else {
      await brandService.createBrand({
        name,
        slug: brandSlug
      });
      setFeedbackMsg(t('admin.brand_created_success'));
    }

    setSaving(false);
    setIsModalOpen(false);
    setTimeout(() => setFeedbackMsg(''), 3000);
    await loadData();
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;
    await brandService.deleteBrand(brandToDelete.id || brandToDelete.slug);
    setBrandToDelete(null);
    setFeedbackMsg(t('admin.brand_deleted_success'));
    setTimeout(() => setFeedbackMsg(''), 3000);
    await loadData();
  };

  const getProductCount = (brandName) => {
    return products.filter((p) => p.brand?.toLowerCase() === brandName?.toLowerCase()).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white flex items-center gap-3">
            <Building2 className="w-8 h-8 text-[#FF7A00]" />
            {t('admin.brands_title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('admin.brands_subtitle')} ({brands.length})
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={PlusCircle}
          onClick={openCreateModal}
          className="font-bold shadow-lg shadow-orange-500/20"
        >
          {t('admin.add_brand_btn')}
        </Button>
      </div>

      {feedbackMsg && (
        <Alert variant="success" title={t('common.success')}>
          {feedbackMsg}
        </Alert>
      )}

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
                  <th className="py-3.5 px-4 font-bold">{t('admin.brand_name_col')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.slug_label')}</th>
                  <th className="py-3.5 px-4 font-bold">{t('admin.products_count_col')}</th>
                  <th className="py-3.5 px-4 font-bold text-right">{t('admin.actions_col')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {brands.map((b) => {
                  const count = getProductCount(b.name);
                  return (
                    <tr key={b.id || b.slug || b.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {b.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {b.slug || b.id}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#FF7A00] font-bold text-[11px] border border-orange-200 dark:border-orange-900">
                          {count} {t('common.items_short')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="xs"
                            icon={Edit2}
                            onClick={() => openEditModal(b)}
                            className="text-slate-600 hover:text-[#FF7A00]"
                          />
                          <Button
                            variant="ghost"
                            size="xs"
                            icon={Trash2}
                            onClick={() => setBrandToDelete(b)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBrand ? t('admin.edit_brand_title') : t('admin.new_brand_title')}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('admin.brand_name_col')} *
            </label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingBrand && !slug) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }
              }}
              placeholder="Apple"
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
              placeholder="apple"
            />
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

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!brandToDelete}
        onClose={() => setBrandToDelete(null)}
        title={t('admin.confirm_delete_title')}
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            {t('admin.confirm_delete_brand_msg')} <strong>{brandToDelete?.name}</strong>?
          </p>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" size="sm" onClick={() => setBrandToDelete(null)}>
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
