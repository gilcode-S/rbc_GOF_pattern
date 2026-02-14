import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Building2, Pencil, Trash2, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { route } from 'ziggy-js';


interface Hotel {
    tenant_id: number;
    hotel_name: string;
    contact_number: string;
    address: string,
    created_at: string,
}

const emptyForm = { hotel_name: "", address: '', contact_number: '' }


export default function ManageHotels() {
    const { hotels } = usePage().props as unknown as { hotels: Hotel[] };
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    // functions
    const handleOpen = () => {
        setForm(emptyForm);
        setOpen(true);
        setErrors({});
        setEditId(null);
        setIsEdit(false);
    }

    const handleOpenEdit = (hotel: Hotel) => {
        setForm({
            hotel_name: hotel.hotel_name,
            address: hotel.address,
            contact_number: hotel.contact_number
        });
        setErrors({});
        setIsEdit(true);
        setOpen(true);
        setEditId(hotel.tenant_id);
    }

    const handleClose = () => {
        setOpen(false);
        setForm(emptyForm);
        setErrors({});
        setIsEdit(false);
        setEditId(null);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (isEdit && editId) {
            router.put(route('hotels.update', editId), form, {
                onSuccess: () => {
                    setLoading(false);
                    handleClose();
                },
                onError: (err) => {
                    setLoading(false);
                    setErrors(err);
                },
            });
        } else {
            router.post(route('hotels.store'), form, {
                onSuccess: () => {
                    setLoading(false);
                    handleClose();
                },
                onError: (err) => {
                    setLoading(false);
                    setErrors(err);
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Manage Hotels", href: '/hotels' }]}>
            <Head title='Manage Hotels' />
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <Building2 className="mr-2 text-blue-500" size={32} />
                        <h1 className='text-2xl font-bold'>Manage Hotel</h1>
                    </div>
                    <Button onClick={handleOpen} className='gap-2'>
                        <Plus size={18} /> {""}
                        Add Hotel
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700">
                    <table className='min-w-full bg-white dark:bg-gray-900'>
                        <thead>
                            <tr className='bg-gray-100 dark:bg-gray-800'>
                                <th className='px-4 py-2 text-left'>Hotel Name</th>
                                <th className='px-4 py-2 text-left'>Address</th>
                                <th className='px-4 py-2 text-left'>Contact</th>
                                <th className='px-4 py-2 text-left'>Created At</th>
                                <th className='px-4 py-2 text-center'>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {hotels && hotels.length > 0 ? hotels.map((hotel) => (
                                <tr key={hotel.tenant_id} className='border-t dark:border-gray-700'>
                                    <td className='px-4 py-2 font-medium'>{hotel.hotel_name}</td>
                                    <td className='px-4 py-2 font-medium'>{hotel.address}</td>
                                    <td className='px-4 py-2 font-medium'>{hotel.contact_number}</td>
                                    <td className='px-4 py-2 font-medium'>{hotel.created_at ? new Date(hotel.created_at).toLocaleDateString() : ''}</td>
                                    <td className='px-4 py-2 text-center'>
                                        <Button size='sm' variant={'outline'} className='mr-2' title='Edit' onClick={() => handleOpenEdit(hotel)}>
                                            <Pencil size={18} />
                                        </Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className='px-4 py-5 text-center text-gray-500 dark:text-gray-400'>No Hotels Found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* add hotel design*/}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{isEdit ? "Edit Hotel" : "Add Hotel"}</DialogTitle>
                        </DialogHeader>

                        {/* form */}
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div className="">
                                <label htmlFor="hotel_name" className='block mb-1 font-medium'>Hotel Name</label>
                                <input type="text" id='hotel_name' name='hotel_name' value={form.hotel_name} onChange={handleChange} className='w-full rounded border px-3 py-2 border-gray-800 dark:border-gray-700' required />
                                {errors.hotel_name && <div className='text-red-600 text-xs mt-1'>{errors.hotel_name[0]}</div>}
                            </div>

                            <div className="">
                                <label htmlFor="address" className='block mb-1 font-medium'>Hotel Address</label>
                                <input type="text" id='address' name='address' value={form.address} onChange={handleChange} className='w-full rounded border px-3 py-2  dark:border-gray-700' required />
                                {errors.address && <div className='text-red-600 text-xs mt-1'>{errors.address[0]}</div>}
                            </div>

                            <div className="">
                                <label htmlFor="contact_number" className='block mb-1 font-medium'>Hotel Contact Number</label>
                                <input type="number" id='contact_number' name='contact_number' value={form.contact_number} onChange={handleChange} className='w-full rounded border px-3 py-2  dark:border-gray-700' required />
                                {errors.contact_number && <div className='text-red-600 text-xs mt-1'>{errors.contact_number[0]}</div>}
                            </div>
                            <DialogFooter>
                                <Button type='button' variant={'outline'} onClick={handleClose} disabled={loading}>Cancel</Button>
                                <Button type='submit' disabled={loading}>
                                    { loading ? (isEdit ? 'Saving. . . ' : 'Adding. . .') : (isEdit ? 'Save Changes' : 'Add Hotel')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    )


}