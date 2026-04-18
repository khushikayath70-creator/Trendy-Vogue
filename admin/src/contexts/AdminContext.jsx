// admin/src/contexts/AdminContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [cloths, setCloths] = useState([]);
  const [footWears, setFootWears] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) setIsAuthenticated(true);
  }, []);

  const fetchAllData = async () => {
    setLoading(true);

    try {
      const results = await Promise.allSettled([
        API.get('/products'),
        API.get('/cloths'),
        API.get('/footWear'),
        API.get('/saleItems'),
      ]);

      const [productsRes, clothsRes, footWearsRes, saleRes] = results;

      if (productsRes.status === 'fulfilled') {
        setProducts(productsRes.value.data);
      } else {
        console.error('Failed to fetch products:', productsRes.reason);
        setProducts([]);
      }

      if (clothsRes.status === 'fulfilled') {
        setCloths(clothsRes.value.data);
      } else {
        console.error('Failed to fetch cloths:', clothsRes.reason);
        setCloths([]);
      }

      if (footWearsRes.status === 'fulfilled') {
        setFootWears(footWearsRes.value.data);
      } else {
        console.error('Failed to fetch foot wears:', footWearsRes.reason);
        setFootWears([]);
      }

      if (saleRes.status === 'fulfilled') {
        setSaleItems(saleRes.value.data);
      } else {
        console.error('Failed to fetch sale items:', saleRes.reason);
        setSaleItems([]);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const login = async (password) => {
    if (password === 'admin123') {
      localStorage.setItem('adminToken', 'dummy-token');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setProducts([]);
    setCloths([]);
    setFootWears([]);
    setSaleItems([]);
  };

  // Products
  const addProduct = async (product) => {
    const res = await API.post('/products', product);
    setProducts((prev) => [...prev, res.data]);
    return res.data;
  };

  const updateProduct = async (id, product) => {
    const res = await API.put(`/products/${id}`, product);
    setProducts((prev) =>
      prev.map((item) => (item._id === id || item.id === id ? res.data : item))
    );
    return res.data;
  };

  const deleteProduct = async (id) => {
    await API.delete(`/products/${id}`);
    setProducts((prev) => prev.filter((item) => item._id !== id && item.id !== id));
  };

  // Cloths
  const addCloth = async (cloth) => {
    const res = await API.post('/cloths', cloth);
    setCloths((prev) => [...prev, res.data]);
    return res.data;
  };

  const updateCloth = async (id, cloth) => {
    const res = await API.put(`/cloths/${id}`, cloth);
    setCloths((prev) =>
      prev.map((item) => (item._id === id || item.id === id ? res.data : item))
    );
    return res.data;
  };

  const deleteCloth = async (id) => {
    await API.delete(`/cloths/${id}`);
    setCloths((prev) => prev.filter((item) => item._id !== id && item.id !== id));
  };

  // FootWear
 // FootWear
const addFootWear = async (item) => {
  const res = await API.post('/foot-wear', item);
  setFootWears((prev) => [...prev, res.data]);
  return res.data;
};

const updateFootWear = async (id, item) => {
  const res = await API.put(`/foot-wear/${id}`, item);
  setFootWears((prev) =>
    prev.map((fw) => (fw._id === id || fw.id === id ? res.data : fw))
  );
  return res.data;
};

const deleteFootWear = async (id) => {
  await API.delete(`/foot-wear/${id}`);
  setFootWears((prev) =>
    prev.filter((fw) => fw._id !== id && fw.id !== id)
  );
};

  // Sale Items
  const addSaleItem = async (item) => {
    const res = await API.post('/saleItems', item);
    setSaleItems((prev) => [...prev, res.data]);
    return res.data;
  };

  const updateSaleItem = async (id, item) => {
    const res = await API.put(`/saleItems/${id}`, item);
    setSaleItems((prev) =>
      prev.map((sale) => (sale._id === id || sale.id === id ? res.data : sale))
    );
    return res.data;
  };

  const deleteSaleItem = async (id) => {
    await API.delete(`/saleItems/${id}`);
    setSaleItems((prev) => prev.filter((sale) => sale._id !== id && sale.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,

        products,
        cloths,
        // footWears,
        footwear: footWears,
        saleItems,

        addProduct,
        updateProduct,
        deleteProduct,

        addCloth,
        updateCloth,
        deleteCloth,

        addFootWear,
        updateFootWear,
        deleteFootWear,

        addSaleItem,
        updateSaleItem,
        deleteSaleItem,

        fetchAllData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);