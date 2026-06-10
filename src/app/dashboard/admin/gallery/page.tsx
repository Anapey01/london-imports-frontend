/**
 * London's Imports - Admin Delivery Gallery Management
 * Premium 'Atelier' architectural system for managing delivery proof assets
 */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
    Plus, 
    Pencil, 
    Trash2, 
    Eye, 
    EyeOff, 
    AlertCircle, 
    Image as ImageIcon,
    Upload,
    X,
    Loader2,
    Layers,
    Save
} from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { ConfirmModal } from '@/components/dashboard/ConfirmModal';
import { AuraAlert, AlertType } from '@/components/AuraAlert';
import { AnimatePresence, motion } from 'framer-motion';
import { adminAPI } from '@/lib/api';

interface DeliveryPhoto {
    id: string;
    image: string;
    caption: string;
    category: string;
    order: number;
    is_active: boolean;
    created_at: string;
}

export default function AdminGalleryPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const [photos, setPhotos] = useState<DeliveryPhoto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state for Add/Edit
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState<DeliveryPhoto | null>(null);
    const [caption, setCaption] = useState('');
    const [category, setCategory] = useState('DELIVERY');
    const [order, setOrder] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Confirmation Modal
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const [alerts, setAlerts] = useState<Array<{ id: string; message: string; type: AlertType }>>([]);

    const addAlert = (message: string, type: AlertType = 'success') => {
        const id = Math.random().toString(36).substring(7);
        setAlerts(prev => [...prev, { id, message, type }]);
    };

    const removeAlert = (id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const fetchPhotos = async () => {
        try {
            setIsLoading(true);
            const response = await adminAPI.deliveryPhotos();
            setPhotos(response.data.results || response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch gallery photos');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleOpenAdd = () => {
        setEditingPhoto(null);
        setCaption('');
        setCategory('DELIVERY');
        setOrder(photos.length ? Math.max(...photos.map(p => p.order)) + 10 : 10);
        setIsActive(true);
        setImageFile(null);
        setImagePreview(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (photo: DeliveryPhoto) => {
        setEditingPhoto(photo);
        setCaption(photo.caption || '');
        setCategory(photo.category || 'DELIVERY');
        setOrder(photo.order);
        setIsActive(photo.is_active);
        setImageFile(null);
        setImagePreview(photo.image);
        setIsFormOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        if (!imagePreview && !editingPhoto) {
            setError('Please upload a delivery photo.');
            setIsSaving(false);
            return;
        }

        try {
            let imageUrl = editingPhoto?.image || '';

            // 1. If new image file is uploaded, push it to Cloudinary
            if (imageFile) {
                const cloudinaryData = new FormData();
                cloudinaryData.append('file', imageFile);
                cloudinaryData.append('upload_preset', 'londons_imports');
                
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dg67twduw';
                const uploadRes = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    { method: 'POST', body: cloudinaryData }
                );

                if (!uploadRes.ok) throw new Error('Cloudinary image upload failed');
                const uploadResult = await uploadRes.json();
                imageUrl = uploadResult.secure_url;
            }

            const payload = {
                caption,
                category,
                order,
                is_active: isActive,
                image: imageUrl
            };

            if (editingPhoto) {
                // Update
                const response = await adminAPI.updateDeliveryPhoto(editingPhoto.id, payload);
                setPhotos(photos.map(p => p.id === editingPhoto.id ? response.data : p));
                addAlert('Gallery photo updated successfully');
            } else {
                // Create
                const response = await adminAPI.createDeliveryPhoto(payload);
                setPhotos([response.data, ...photos]);
                addAlert('Gallery photo added successfully');
            }

            setIsFormOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Save operation failed');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = (id: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Photo',
            message: 'Are you sure you want to permanently delete this delivery proof photo from the homepage gallery?',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    await adminAPI.deleteDeliveryPhoto(id);
                    setPhotos(photos.filter(p => p.id !== id));
                    addAlert('Photo deleted successfully');
                } catch (err) {
                    addAlert(err instanceof Error ? err.message : 'Delete failed', 'error');
                }
            }
        });
    };

    const handleToggleActive = async (photo: DeliveryPhoto) => {
        try {
            const response = await adminAPI.updateDeliveryPhoto(photo.id, { is_active: !photo.is_active });
            setPhotos(photos.map(p => p.id === photo.id ? { ...p, is_active: response.data.is_active } : p));
            addAlert(`Photo ${response.data.is_active ? 'published' : 'hidden'} successfully`);
        } catch (err) {
            addAlert(err instanceof Error ? err.message : 'Update failed', 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6 p-8">
                <div className="h-20 bg-slate-50 animate-pulse border border-slate-100 rounded-none"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-64 bg-slate-50 animate-pulse border border-slate-100 rounded-none"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-32">
            {/* 1. COMMAND HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-50 pb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-slate-950 tracking-tighter">Delivery Gallery</h1>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">{photos.length} PHOTOS</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleOpenAdd}
                    className="px-8 py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all flex items-center gap-3"
                >
                    <Plus className="w-4 h-4" />
                    ADD PHOTO
                </button>
            </div>

            {error && (
                <div className="p-6 bg-red-50 border-l border-red-600 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-4">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    ERROR: {error}
                </div>
            )}

            {/* 2. GALLERY GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {photos.map((photo) => (
                    <div 
                        key={photo.id} 
                        className={`group bg-white border transition-all duration-500 flex flex-col justify-between ${
                            photo.is_active ? 'border-slate-100' : 'border-slate-100 opacity-60'
                        } hover:border-slate-900`}
                    >
                        {/* Image block */}
                        <div className="aspect-[4/3] relative w-full bg-slate-50 border-b border-slate-50 overflow-hidden">
                            <Image
                                src={photo.image}
                                alt={photo.caption || 'Delivery Photo'}
                                fill
                                className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                                    !photo.is_active ? 'grayscale opacity-40' : 'grayscale group-hover:grayscale-0'
                                }`}
                            />
                            
                            {/* Sort order tag */}
                            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[8px] font-mono text-white tracking-widest flex items-center gap-2">
                                <Layers className="w-3 h-3 text-emerald-400" />
                                ORDER: {photo.order}
                            </div>

                            {/* Category Badge */}
                            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[8px] font-mono text-white tracking-widest uppercase">
                                {photo.category === 'DELIVERY' ? 'DELIVERY PROOF' :
                                 photo.category === 'TEAM' ? 'OUR TEAM' :
                                 photo.category === 'OFFICE' ? 'OUR OFFICE' :
                                 photo.category === 'WAREHOUSE' ? 'OUR WAREHOUSE' :
                                 photo.category === 'PACKAGING' ? 'PACKAGING OP' :
                                 photo.category === 'PICKUP' ? 'CUSTOMER PICKUP' : photo.category || 'DELIVERY'}
                            </div>

                            {/* Action icons overlay */}
                            <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                                <button
                                    onClick={() => handleToggleActive(photo)}
                                    className={`p-3 bg-white hover:bg-slate-900 hover:text-white transition-all text-slate-900`}
                                    title={photo.is_active ? 'Hide Photo' : 'Show Photo'}
                                >
                                    {photo.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => handleOpenEdit(photo)}
                                    className="p-3 bg-white hover:bg-slate-900 hover:text-white transition-all text-slate-900"
                                    title="Edit Photo"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(photo.id)}
                                    className="p-3 bg-white hover:bg-red-600 hover:text-white transition-all text-slate-900"
                                    title="Delete Photo"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Caption Block */}
                        <div className="p-6 space-y-3">
                            <p className="text-[11px] font-black uppercase tracking-wider text-slate-900 line-clamp-1">
                                {photo.caption || <span className="italic text-slate-300 font-bold">No caption</span>}
                            </p>
                            <div className="flex items-center justify-between text-[8px] font-bold text-slate-400 tracking-widest uppercase">
                                <span>ADDED: {new Date(photo.created_at).toLocaleDateString()}</span>
                                <span className={photo.is_active ? 'text-emerald-500 font-black' : 'text-slate-400 font-black'}>
                                    {photo.is_active ? 'VISIBLE' : 'HIDDEN'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {photos.length === 0 && (
                    <div className="col-span-full py-32 text-center border border-dashed border-slate-100">
                        <ImageIcon className="w-12 h-12 mx-auto mb-6 text-slate-100" strokeWidth={1} />
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-300">No Gallery Photos</p>
                    </div>
                )}
            </div>

            {/* 3. ADD / EDIT DIALOG (MODAL) */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
                            onClick={() => !isSaving && setIsFormOpen(false)}
                        />

                        {/* Modal Container */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className={`w-full max-w-lg bg-white border border-slate-100 overflow-hidden relative z-10 p-8 shadow-diffusion-lg`}
                        >
                            <div className="flex items-center justify-between border-b border-slate-50 pb-6 mb-8">
                                <h2 className="text-xl font-serif font-bold text-slate-950 tracking-tighter">
                                    {editingPhoto ? 'Edit Photo Details' : 'Add Gallery Photo'}
                                </h2>
                                <button 
                                    onClick={() => !isSaving && setIsFormOpen(false)}
                                    className="p-1 hover:bg-slate-50 transition-colors text-slate-400 hover:text-slate-900"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                                {/* Uploader */}
                                <div className="space-y-2">
                                    <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                                        Photo Image
                                    </label>
                                    <div 
                                        className={`relative aspect-[4/3] border border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 hover:border-slate-900 bg-slate-50/50`}
                                    >
                                        {imagePreview ? (
                                            <>
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                {!isSaving && (
                                                    <button
                                                        type="button"
                                                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                                                        className="absolute top-4 right-4 p-2 bg-slate-900/80 text-white hover:bg-slate-900 transition-all z-10"
                                                        title="Remove Image"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <input
                                                    type="file"
                                                    id="gallery-photo-upload"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                                <label
                                                    htmlFor="gallery-photo-upload"
                                                    className="cursor-pointer flex flex-col items-center gap-3 px-6 text-center py-12"
                                                >
                                                    <div className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100">
                                                        <Upload className="w-5 h-5 text-slate-400" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[11px] font-black uppercase tracking-wider text-slate-900">Upload Delivery Proof</p>
                                                        <p className="text-[9px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
                                                            JPG, PNG, or WEBP. Max 20MB.
                                                        </p>
                                                    </div>
                                                </label>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <label htmlFor="category" className="block text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                                        Asset Category
                                    </label>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-100 focus:border-slate-900 text-xs font-bold text-slate-900 uppercase tracking-wider bg-white transition-colors"
                                    >
                                        <option value="DELIVERY">Delivery Proof (Homepage)</option>
                                        <option value="TEAM">Our Team (About Page)</option>
                                        <option value="OFFICE">Our Office (About Page)</option>
                                        <option value="WAREHOUSE">Our Warehouse (About Page)</option>
                                        <option value="PACKAGING">Packaging Operations (About Page)</option>
                                        <option value="PICKUP">Customer Pickup (About Page)</option>
                                    </select>
                                </div>

                                {/* Caption */}
                                <div className="space-y-2">
                                    <label htmlFor="caption" className="block text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                                        Caption / Location
                                    </label>
                                    <input
                                        type="text"
                                        id="caption"
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        placeholder="e.g. Accra Warehouse Sourcing Batch 10"
                                        className="w-full px-4 py-3 border border-slate-100 focus:border-slate-900 text-xs font-bold text-slate-900 placeholder:text-slate-300 uppercase tracking-wider transition-colors"
                                    />
                                </div>

                                {/* Order & Active */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="order" className="block text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
                                            Sort Order
                                        </label>
                                        <input
                                            type="number"
                                            id="order"
                                            value={order}
                                            onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                                            className="w-full px-4 py-3 border border-slate-100 focus:border-slate-900 text-xs font-bold text-slate-900 transition-colors"
                                        />
                                    </div>

                                    <div className="flex items-center h-full pt-6">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isActive}
                                                onChange={(e) => setIsActive(e.target.checked)}
                                                className="w-4 h-4 border-slate-200 accent-emerald-500 rounded-none focus:ring-0 focus:ring-offset-0"
                                            />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">PUBLISH LIVE</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end gap-4 border-t border-slate-50 pt-6 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormOpen(false)}
                                        disabled={isSaving}
                                        className="px-6 py-3 border border-slate-100 hover:border-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-900 transition-all disabled:opacity-40"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-8 py-3 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-3 disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                SAVING...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                SAVE ASSET
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />

            {/* Alerts */}
            <div className="fixed bottom-12 left-0 right-0 z-[110] pointer-events-none flex flex-col items-center">
                <AnimatePresence mode="popLayout">
                    {alerts.map(alert => (
                        <AuraAlert
                            key={alert.id}
                            id={alert.id}
                            message={alert.message}
                            type={alert.type}
                            onClose={removeAlert}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
