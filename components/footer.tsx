import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="footer-brand">
        <Link href="/" className="logo">
          <span>t</span> techie<span>smart</span>
        </Link>
        <p>
          Community + commerce + savings.
          <br />
          Built for everyday India.
        </p>
      </div>
      <div>
        <b>Shop</b>
        <Link href="/shop">All products</Link>
        <Link href="/bogo">BOGO marketplace</Link>
        <Link href="/categories">Categories</Link>
        <Link href="/sale">Sale</Link>
      </div>
      <div>
        <b>Participate</b>
        <Link href="/services">Services</Link>
        <Link href="/community">Community</Link>
        <Link href="/resellers">Sell an item</Link>
        <Link href="/import">Import Hub</Link>
      </div>
      <div>
        <b>Support</b>
        <Link href="/orders">Orders</Link>
        <Link href="/account">Account</Link>
        <Link href="/help">Help centre</Link>
        <Link href="/trust">Trust & safety</Link>
      </div>
      <div className="footer-bottom">
        <span>All rights reversed by srikanth chundru copyright 2026</span>
        <span>Privacy · Terms · Returns</span>
      </div>
    </footer>
  )
}
