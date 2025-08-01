import React from 'react';
import styles from './CreateProduct.module.css';
import { useViewModel } from './ViewModel';

const CreateProduct: React.FC = () => {
  const { product, setProduct, handleSubmit, loading, error, handleRemoveImage } = useViewModel();
  const isEdit = false;

  // Cloudinary config desde variables de entorno
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  return (
    <div className={styles.container}>
      <h2>Crear Nuevo Producto</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="codigo">Código</label>
          <input id="codigo" type="text" value={product.product_code}
            onChange={e => setProduct({ ...product, product_code: e.target.value })} required disabled={isEdit} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" type="text" value={product.name}
            onChange={e => setProduct({ ...product, name: e.target.value })} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="categoria">Categoría</label>
          <input id="categoria" type="text" value={product.category}
            onChange={e => setProduct({ ...product, category: e.target.value })} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="precio">Precio</label>
          <input id="precio" type="number" value={product.price}
            onChange={e => setProduct({ ...product, price: Number(e.target.value) })} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="stock">Stock</label>
          <input id="stock" type="number" value={product.stock}
            onChange={e => setProduct({ ...product, stock: Number(e.target.value) })} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="descripcion">Descripción</label>
          <textarea id="descripcion" value={product.description}
            onChange={e => setProduct({ ...product, description: e.target.value })} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="peso">Peso</label>
          <input id="peso" type="number" step="0.01" value={product.weight}
            onChange={e => setProduct({ ...product, weight: Number(e.target.value) })} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="material">Material</label>
          <input id="material" type="text" value={product.material}
            onChange={e => setProduct({ ...product, material: e.target.value })} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="gema">Tipo de Gema</label>
          <input id="gema" type="text" value={product.gemstone_type}
            onChange={e => setProduct({ ...product, gemstone_type: e.target.value })} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="tamano-gema">Tamaño de Gema</label>
          <input id="tamano-gema" type="number" step="0.01" value={product.gemstone_size}
            onChange={e => setProduct({ ...product, gemstone_size: Number(e.target.value) })} />
        </div>
        <div className={styles.inputGroup}>
          <label>
            <input type="checkbox" checked={product.is_wedding}
              onChange={e => setProduct({ ...product, is_wedding: e.target.checked })} />
            ¿Es para matrimonio?
          </label>
        </div>
        <div className={styles.inputGroup}>
          <label>
            <input type="checkbox" checked={product.is_baby}
              onChange={e => setProduct({ ...product, is_baby: e.target.checked })} />
            ¿Es para bebé?
          </label>
        </div>
        <div className={styles.inputGroup}>
          <label>
            <input type="checkbox" checked={product.is_men}
              onChange={e => setProduct({ ...product, is_men: e.target.checked })} />
            ¿Es para hombres?
          </label>
        </div>

        {/* Uploader de imágenes */}
        <div className={styles.imageUploader}>
          <button
            type="button"
            onClick={() =>
              // @ts-ignore
              window.cloudinary.openUploadWidget(
                {
                  cloudName,
                  uploadPreset,
                  multiple: true,
                  sources: ['local', 'url', 'camera'],
                },
                (error: any, result: any) => {
                  if (!error && result && result.event === "success") {
                    setProduct((prev: any) => ({
                      ...prev,
                      images: [...prev.images, result.info.secure_url]
                    }));
                  }
                }
              )
            }
          >
            Subir imágenes del producto
          </button>

          <div className={styles.imagePreview}>
            {product.images.map((url: string, index: number) => (
              <div key={index} className={styles.imageWrapper}>
                <img src={url} alt={`producto ${index}`} />
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleRemoveImage(url)}
                >X</button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Crear Producto"}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default CreateProduct;
