import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, 
  Check, Plus, Minus, ChevronRight, Zap, ArrowLeft
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage({ onAddToCart, onToggleWishlist, wishlist }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.product) setProduct(data.product);
        if (data.related_products) setRelatedProducts(data.related_products);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading product detail:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem' }}>
          The product you are looking for does not exist or has been removed.
        </p>
        <Link to="/shop" className="btn-primary">Return to Shop</Link>
      </div>
    );
  }

  const isWishlisted = wishlist.some(w => w.id === product.id);
  const discountPercent = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    onAddToCart({ ...product, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    onAddToCart({ ...product, quantity });
    navigate('/checkout');
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'inherit' }}>Home</Link> <ChevronRight size={14} />
        <Link to="/shop" style={{ color: 'inherit' }}>Shop</Link> <ChevronRight size={14} />
        <Link to={`/shop?category=${product.category_id}`} style={{ color: 'inherit' }}>{product.category_name}</Link> <ChevronRight size={14} />
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Main Product Details Card */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '3rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '3rem',
          alignItems: 'start'
        }}>
          {/* Image Display */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '100%',
              paddingTop: '90%',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: 'var(--bg-input)',
              position: 'relative',
              border: '1px solid var(--border-color)'
            }}>
              <img 
                src={product.image_url} 
                alt={product.name}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {discountPercent > 0 && (
                <div style={{ position: 'absolute', top: '15px', left: '15px' }}>
                  <span className="badge badge-discount" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                    -{discountPercent}% OFF
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {product.category_name} • SKU: {product.sku}
              </span>
              <span style={{ fontSize: '0.8rem', color: product.stock > 0 ? 'var(--accent-success)' : 'var(--accent-danger)', fontWeight: 700 }}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '0.75rem' }}>
              {product.name}
            </h1>

            {/* Ratings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', color: 'var(--accent-gold)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} stroke="currentColor" />
                ))}
              </div>
              <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>{product.rating}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({product.review_count} verified customer reviews)</span>
            </div>

            {/* Price Box */}
            <div style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'baseline',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ₨ {product.discount_price ? product.discount_price.toLocaleString() : product.price.toLocaleString()}
              </span>
              {product.discount_price && (
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₨ {product.price.toLocaleString()}
                </span>
              )}
              <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--accent-success)', fontWeight: 700 }}>
                Free Priority Shipping Included
              </span>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* Features List */}
            {product.features && product.features.length > 0 && (
              <div style={{ marginBottom: '1.75rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Key Specifications & Highlights:</h4>
                <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                  {product.features.map((feat, idx) => (
                    <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Check size={16} color="var(--accent-success)" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              {/* Quantity Picker */}
              <div style={{
                display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)'
              }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', color: 'var(--text-primary)' }}>
                  <Minus size={16} />
                </button>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, padding: '0 0.8rem' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', color: 'var(--text-primary)' }}>
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to Cart */}
              <button onClick={handleAddToCart} className="btn-primary" style={{
                flex: 1, minWidth: '180px', padding: '0.85rem 1.5rem', background: added ? 'var(--accent-success)' : 'var(--accent-gradient)'
              }}>
                {added ? <Check size={20} /> : <ShoppingBag size={20} />}
                <span>{added ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>

              {/* Buy Now */}
              <button onClick={handleBuyNow} className="btn-secondary" style={{ padding: '0.85rem 1.5rem', background: 'var(--accent-gold)', color: '#000', border: 'none', fontWeight: 800 }}>
                <Zap size={20} />
                <span>Buy Now</span>
              </button>

              {/* Wishlist Button */}
              <button onClick={() => onToggleWishlist(product)} style={{
                width: '48px', height: '48px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
                background: 'var(--bg-input)', color: isWishlisted ? '#ef4444' : 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Heart size={22} fill={isWishlisted ? '#ef4444' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel Section */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>Related Products You May Like</h2>
          <div className="product-grid">
            {relatedProducts.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlist.some(w => w.id === p.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
