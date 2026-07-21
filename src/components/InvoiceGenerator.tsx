import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';

interface Props {
    booking: any;
    companyName: string;
}

export default function InvoiceGenerator({ booking, companyName }: Props) {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const generatePdf = async () => {
        if (!invoiceRef.current) return;
        
        try {
            const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Invoice_${booking.customer_name.replace(/\s+/g, '_')}_${new Date(booking.date).toISOString().split('T')[0]}.pdf`);
        } catch (e) {
            console.error('Failed to generate PDF:', e);
            alert('Failed to generate PDF');
        }
    };

    return (
        <>
            <button 
                type="button"
                onClick={generatePdf}
                className="w-full mt-2 bg-white/10 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 hover:bg-white/20 transition-colors"
            >
                <Download size={18} /> Generate Invoice (PDF)
            </button>

            {/* Hidden Invoice Template */}
            <div className="hidden">
                <div ref={invoiceRef} className="bg-white text-black p-12 w-[800px] font-sans">
                    <div className="flex justify-between items-start mb-12 border-b-2 border-black pb-8">
                        <div>
                            {/* Therapick Logo placeholder */}
                            <h1 className="text-4xl font-black tracking-widest uppercase">THERAPICK</h1>
                            <p className="text-gray-500 mt-2 text-sm">Premium Mobile Spa Network</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-3xl font-bold text-gray-800">INVOICE</h2>
                            <p className="text-gray-500 mt-1">Date: {new Date().toLocaleDateString()}</p>
                            <p className="text-gray-500">Booking ID: {booking.id.substring(0, 8).toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="flex justify-between mb-12">
                        <div>
                            <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-2">Billed To</h3>
                            <p className="font-bold text-lg">{booking.customer_name}</p>
                            <p className="text-gray-600">{booking.address}</p>
                            <p className="text-gray-600">Room: {booking.room_number || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-2">Service Partner</h3>
                            <p className="font-bold text-lg">{companyName}</p>
                            <p className="text-gray-600">{booking.location_area}</p>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h3 className="font-bold text-gray-400 uppercase text-xs tracking-wider mb-4 border-b pb-2">Appointment Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500 text-sm">Date</p>
                                <p className="font-bold">{new Date(booking.date).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Time</p>
                                <p className="font-bold">{booking.time}</p>
                            </div>
                        </div>
                    </div>

                    <table className="w-full mb-12">
                        <thead>
                            <tr className="border-b-2 border-black">
                                <th className="text-left py-3 font-bold uppercase text-sm tracking-wider">Treatment</th>
                                <th className="text-center py-3 font-bold uppercase text-sm tracking-wider">Duration</th>
                                <th className="text-center py-3 font-bold uppercase text-sm tracking-wider">Guests</th>
                                <th className="text-right py-3 font-bold uppercase text-sm tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {booking.treatments.map((t: any, i: number) => (
                                <tr key={i} className="border-b border-gray-200">
                                    <td className="py-4 font-medium">{t.title}</td>
                                    <td className="py-4 text-center text-gray-600">{t.duration} Mins</td>
                                    <td className="py-4 text-center text-gray-600">{t.guests}</td>
                                    <td className="py-4 text-right font-medium">AED {t.price.toLocaleString('en-US')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end">
                        <div className="w-1/2">
                            <div className="flex justify-between py-3 border-b border-gray-200">
                                <span className="font-bold text-gray-600">Subtotal</span>
                                <span>AED {booking.total_price.toLocaleString('en-US')}</span>
                            </div>
                            <div className="flex justify-between py-4 text-xl font-black">
                                <span>TOTAL</span>
                                <span>AED {booking.total_price.toLocaleString('en-US')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
                        <p>Thank you for choosing Therapick.</p>
                        <p>For any inquiries, please contact your service partner or Therapick support.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
