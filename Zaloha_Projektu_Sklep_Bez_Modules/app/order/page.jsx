import Navbar    from '@/components/Navbar';
import OrderForm from '@/components/OrderForm';

export const metadata = {
  title: 'Objednávka vína',
  description: 'Objednejte moravská vína ze Sklepa u Dvořáků přímo online — rychlá expedice, přímý prodej.',
};

/**
 * app/order/page.jsx
 * Luxury order page — Navbar (transparent) + OrderForm split layout.
 */
export default function OrderPage() {
  return (
    <main>
      <Navbar />
      <OrderForm />
    </main>
  );
}