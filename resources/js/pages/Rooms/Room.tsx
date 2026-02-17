

import { usePage, router } from "@inertiajs/react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";

// variables and forms
const emptyForm = { room_number: '', type: 'single', price_per_night: '', status: 'available' };

export default function Room() {
  const { rooms = [] } = usePage().props;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // functions
  const handleOpenAdd = () => {
    setForm(emptyForm);
    setIsEdit(false);
    setEditId(null);
    setOpen(true);
  };

  const handleOpenEdit = (room: any) => {
    setForm({
      room_number: room.room_number,
      type: room.type,
      price_per_night: room.price_per_night,
      status: room.status,
    });
    setEditId(room.room_id);
    setIsEdit(true);
    setOpen(true);
  };

  const handleClose = () => {
    setForm(emptyForm);
    setIsEdit(false);
    setEditId(null);
    setOpen(false);
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (isEdit && editId) {
      router.put(`/rooms/${editId}`, form, {
        onSuccess: handleClose,
      });
    } else {
      router.post('/rooms', form, {
        onSuccess: handleClose
      });
    }
  };

  const handleDelete = (id: any) => {
    if (window.confirm('Are you sure you want to delete this? ')) {
      router.delete(`/rooms/${id}`);
    };
  };

  const roomList = Array.isArray(rooms) ? rooms : [];

  return (
    <AppLayout breadcrumbs={[{ title: 'Rooms', href: '/rooms' }]}>
      <Card className="p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Room</h1>
          <Button className="" onClick={handleOpenAdd}>Add Room</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm rounded-lg">
            <thead className="bg-gray-200 dark:bg-neutral-700">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Room #</th>
                <th className="px-4 py-2 text-left font-semibold">Room type</th>
                <th className="px-4 py-2 text-left font-semibold">Room price</th>
                <th className="px-4 py-2 text-left font-semibold">Room status</th>
                <th className="px-4 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {roomList.map((room: any) => (
                <tr key={room.room_id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-neutral-700">
                  <td className="px-4 py-2">{room.room_number}</td>
                  <td className="px-4 py-2 capitalize">{room.type}</td>
                  <td className="px-4 py-2">{room.price_per_night}</td>
                  <td className="px-4 py-2 capitalize">{room.status}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <Button size={'sm'} variant={'outline'} onClick={() => handleOpenEdit(room)}>Edit</Button>
                    <Button size={'sm'} variant={'destructive'} onClick={() => handleDelete(room.room_id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Update Room" : 'Add Room'}</DialogTitle>
          </DialogHeader>

          {/* submit form also edit form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="">
              <Label htmlFor="room_number">Room Number</Label>
              <Input id="room_number" name="room_number" value={form.room_number} required onChange={handleChange}></Input>
            </div>
            <div className="">
              <Label htmlFor="type">Room Type</Label>
              <Select value={form.type} required onValueChange={v => setForm({ ...form, type: v })}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="">
              <Label htmlFor="price_per_night">Room Price Per Night</Label>
              <Input
                id="price_per_night"
                name="price_per_night"
                type="number" onChange={handleChange}
                value={form.price_per_night}
                required></Input>
            </div>
            <div className="">
              <Label htmlFor="status">Room Status</Label>
              <Select value={form.status}
                required
                onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status"></SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant={'outline'} onClick={handleClose}>Cancel</Button>
              <Button type="submit" >{isEdit ? "Upadte" : "Add"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
