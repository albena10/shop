import React from 'react';
import {useState, useEffect} from "react";
import './App.css'

const App = () => {
    const baseUrl = "https://dummyjson.com/products?limit=100";
    const [products, setProd] =useState([])
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    useEffect(() => {
        fetch(baseUrl)
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => setProd(data.products || data))
            .catch(err => console.error("Fetch error:", err));
    }, []);

    const grouped = products.reduce((acc, product) => {
        const categoryName = product.category; // просто строка
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(product);
        return acc;
    }, {});

    const allCategories = ["all", ...Object.keys(grouped)];



    return (
        <div className="clothes">
            <h1>Shop</h1>

            <div>
                <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{padding: "8px", width: "250px", marginRight: "15px", color: "black"}}
                />

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{padding: "8px"}}
                >
                    <option value="all">All categories</option>
                    {allCategories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>


            {Object.entries(grouped)
                .filter(([category]) =>
                    categoryFilter === "all" || category === categoryFilter
                )
                .map(([category, products]) => {

                    const filteredProducts = products.filter((p) =>
                        p.title.toLowerCase().includes(search.toLowerCase())
                    );

                    if (filteredProducts.length === 0) return null;

                    return (
                        <div key={category}>
                            <h2 className="h2">{category}</h2>

                            <div className="clothes-box">
                                {filteredProducts.map((p) => (
                                    <div className="product" key={p.id}>
                                        <img src={p.images[0]} alt={p.title} width="350" />
                                        <h2 className="title">{p.title}</h2>
                                        <p className="price">${p.price}</p>
                                        <p className="descpription">{p.description}</p>
                                        <p className="category">{p.category}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default App;