import React, { useEffect, useState } from "react";
import "./App.css";

const initialClothes = [
  {
    id: 1,
    name: "Black Shirt",
    category: "Shirt",
    emoji: "👔",
    image: "https://rukminim1.flixcart.com/image/1280/1280/xif0q/shirt/p/l/k/l-chameli-black-brocon-original-imahmjtjfkpgv5tb.jpeg?q=90",
    favorite: true
  },
  {
    id: 2,
    name: "Blue Jeans",
    category: "Bottoms",
    emoji: "👖",
    image: "https://rukminim2.flixcart.com/image/612/612/xif0q/jean/p/0/o/30-dpf-mj-baggy058-playfeel-original-imahejydfzqygses.jpeg?q=70",
    favorite: false
  },
  {
    id: 3,
    name: "Summer Dress",
    category: "Dresses",
    emoji: "👗",
    image: "https://rukminim2.flixcart.com/image/612/612/xif0q/dress/1/d/r/s-12674mn-metronaut-original-imahrkqtnhyybntr.jpeg?q=70",
    favorite: true
  },
  {
    id: 4,
    name: "Sneakers",
    category: "Shoes",
    emoji: "👟",
    image: "https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/f/b/6/8-11331-wt-8-t-rock-white-original-imahe9sfzth2afdz.jpeg?q=70",
    favorite: false
  },
  {
  id: 5,
  name: "Pink Top",
  category: "Tops",
  emoji: "👚",
  image: "https://rukminim2.flixcart.com/image/612/612/xif0q/top/q/g/p/m-1-cotton-stripe-puff-sleeve-shirt-with-bow-dzeb-resized-original-imahheg8wm2gv4hp.jpeg?q=70",
  favorite: true
},
  {
    id: 6,
    name: "Handbag",
    category: "Accessories",
    emoji: "👜",
    image: "https://rukminim2.flixcart.com/image/612/612/xif0q/hand-messenger-bag/x/h/t/hobo-8-nx-hb-ofw-001-hobo-nexivo-12-original-imahpafs79xnhmhw.jpeg?q=70",
    favorite: false
  },
  {
  id: 7,
  name: "Titan Watch",
  category: "Watch",
  emoji: "⌚",
  image: "https://rukminim2.flixcart.com/image/612/612/xif0q/watch/v/y/r/-original-imahz8xzw9t4sqsf.jpeg?q=70",
  favorite: false
},

{
  id: 8,
  name: "Bracelet",
  category: "Accessories",
  emoji: "📿",
  image: "https://rukminim1.flixcart.com/image/240/296/xif0q/bangle-bracelet-armlet/x/b/y/free-2-8-na-1-cc-015-gold-vinayak-resized-original-imahgqqvn6zw5bbs.jpeg?q=60",
  favorite: false
},
];


function App() {
  const [page, setPage] = useState("Dashboard");

  const [clothes, setClothes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sm-clothes")) || initialClothes;
    } catch {
      return initialClothes;
    }
  });

  const [outfits, setOutfits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sm-outfits")) || [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "Tops",
    image: "",
  });

  const [selected, setSelected] = useState({
    Tops: "",
    Bottoms: "",
    Shoes: "",
  });

  const [planner, setPlanner] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sm-planner")) || {};
    } catch {
      return {};
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sm-profile")) || {
        name: "Fashion Lover",
        email: "",
      };
    } catch {
      return { name: "Fashion Lover", email: "" };
    }
  });

  useEffect(() => {
    localStorage.setItem("sm-clothes", JSON.stringify(clothes));
  }, [clothes]);

  useEffect(() => {
    localStorage.setItem("sm-outfits", JSON.stringify(outfits));
  }, [outfits]);

  useEffect(() => {
    localStorage.setItem("sm-planner", JSON.stringify(planner));
  }, [planner]);

  useEffect(() => {
    localStorage.setItem("sm-profile", JSON.stringify(profile));
  }, [profile]);

  const menu = [
    ["Dashboard", "⌂"],
    ["My Wardrobe", "♧"],
    ["Outfit Studio", "✧"],
    ["Outfit Planner", "▦"],
    ["My Favorites", "♡"],
    ["Profile", "♙"],
  ];

  const filteredClothes = clothes.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "All" || item.category === category) &&
    (page !== "My Favorites" || item.favorite)
  );

  const getItem = (id) =>
    clothes.find((item) => item.id === Number(id));

  const toggleFavorite = (id) => {
    setClothes((old) =>
      old.map((item) =>
        item.id === id
          ? { ...item, favorite: !item.favorite }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    setClothes((old) => old.filter((item) => item.id !== id));
    setSelected((old) => {
      const next = { ...old };
      Object.keys(next).forEach((key) => {
        if (Number(next[key]) === id) next[key] = "";
      });
      return next;
    });
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Select an image file.");
      return;
    }

    if (file.size > 1024 * 1024) {
      alert("Image must be smaller than 1 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () =>
      setNewItem((old) => ({ ...old, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const addClothing = (e) => {
    e.preventDefault();

    if (!newItem.name.trim()) return;

    setClothes((old) => [
      {
        id: Date.now(),
        name: newItem.name.trim(),
        category: newItem.category,
        emoji: "👕",
        image: newItem.image,
        favorite: false,
      },
      ...old,
    ]);

    setNewItem({ name: "", category: "Tops", image: "" });
    setShowForm(false);
  };

  const saveOutfit = () => {
    const ids = Object.values(selected).filter(Boolean);

    if (!ids.length) {
      alert("Please select clothing first.");
      return;
    }

    setOutfits((old) => [
      {
        id: Date.now(),
        name: `My Look ${old.length + 1}`,
        items: ids.map(Number),
        favorite: false,
      },
      ...old,
    ]);

    setSelected({ Tops: "", Bottoms: "", Shoes: "" });
    alert("Outfit saved successfully!");
  };

  const toggleOutfitFavorite = (id) => {
    setOutfits((old) =>
      old.map((item) =>
        item.id === id
          ? { ...item, favorite: !item.favorite }
          : item
      )
    );
  };

  const renderClothingCard = (item) => (
    <div className="clothing-card" key={item.id}>
      <div className="clothing-image">
        {item.image ? (
          <img src={item.image} alt={item.name} />
        ) : (
          <span>{item.emoji}</span>
        )}

        <button
          className={`heart-btn ${item.favorite ? "liked" : ""}`}
          onClick={() => toggleFavorite(item.id)}
        >
          {item.favorite ? "♥" : "♡"}
        </button>
      </div>

      <div className="clothing-info">
        <div>
          <h3>{item.name}</h3>
          <p>{item.category}</p>
        </div>

        <button
          className="delete-btn"
          onClick={() => {
            if (window.confirm("Delete this item?")) deleteItem(item.id);
          }}
        >
          ×
        </button>
      </div>
    </div>
  );

  const renderOutfitCard = (outfit) => (
    <div className="outfit-card" key={outfit.id}>
      <div className="outfit-preview">
        {outfit.items.map((id) => {
          const item = getItem(id);
          if (!item) return null;

          return (
            <div className="outfit-mini" key={id}>
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : item.emoji}
            </div>
          );
        })}
      </div>

      <div className="outfit-info">
        <h3>{outfit.name}</h3>
        <p>{outfit.items.length} pieces</p>
        <button
          className="text-btn"
          onClick={() => toggleOutfitFavorite(outfit.id)}
        >
          {outfit.favorite ? "♥ Saved" : "♡ Add to favorites"}
        </button>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <>

<div className="welcome-banner">
  <div>
    <span className="eyebrow">YOUR PERSONAL STYLE SPACE</span>
    <h2>Style starts with you.</h2>
    <p>
      Organize your wardrobe, create beautiful looks and discover your personal style.
    </p>
    <button
      className="primary-btn"
      onClick={() => setPage("Outfit Studio")}
    >
      Create an Outfit →
    </button>
  </div>

  <div className="banner-emoji">
    <img
      src="https://rukminim2.flixcart.com/image/612/612/xif0q/dress/4/b/1/s-831-beauty-party-denizli-fashion-original-imahsmqrn5vpnt5y.jpeg?q=70"
      alt="Fashion Dress"
    />
  </div>
</div>


      <div className="stats-grid">
        <div className="stat-card">
          <span>👚</span>
          <p>Total Clothing</p>
          <h2>{clothes.length}</h2>
        </div>
        <div className="stat-card">
          <span>♡</span>
          <p>Favorite Items</p>
          <h2>{clothes.filter(x => x.favorite).length}</h2>
        </div>
        <div className="stat-card">
          <span>✧</span>
          <p>Saved Outfits</p>
          <h2>{outfits.length}</h2>
        </div>
        <div className="stat-card">
          <span>▦</span>
          <p>Planned Days</p>
          <h2>{Object.values(planner).filter(Boolean).length}</h2>
        </div>
      </div>

      <div className="section-heading">
        <h2>Recently Added</h2>
        <button className="text-btn" onClick={() => setPage("My Wardrobe")}>
          View all →
        </button>
      </div>

      <div className="clothing-grid">
        {clothes.slice(0, 4).map(renderClothingCard)}
      </div>

      <div className="section-heading">
        <h2>Saved Outfits</h2>
        <button className="text-btn" onClick={() => setPage("Outfit Studio")}>
          Create new →
        </button>
      </div>

      <div className="outfit-grid">
        {outfits.slice(0, 3).map(renderOutfitCard)}
        {!outfits.length && <p className="empty-message">No outfits saved yet.</p>}
      </div>
    </>
  );

  const renderWardrobe = () => (
    <>
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR COLLECTION</span>
          <h2>{page === "My Favorites" ? "My Favorites" : "My Wardrobe"}</h2>
          <p className="muted">{clothes.length} pieces in your collection</p>
        </div>

        {page !== "My Favorites" && (
          <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
            + Add Clothing
          </button>
        )}
      </div>

      {showForm && (
        <form className="add-form" onSubmit={addClothing}>
          <h3>Add New Clothing</h3>

          <label>Clothing Name</label>
          <input
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            placeholder="e.g. Black T-shirt"
            required
          />

          <label>Category</label>
          <select
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          >
            {["Tops", "Bottoms", "Dresses", "Shoes", "Accessories","Watch",].map(x =>
              <option key={x}>{x}</option>
            )}
          </select>

          <label>Upload Photo (Max 1 MB)</label>
          <input type="file" accept="image/*" onChange={handleImage} />

          {newItem.image && (
            <img className="upload-preview" src={newItem.image} alt="Preview" />
          )}

          <div className="form-actions">
            <button className="primary-btn">Save Item</button>
            <button type="button" className="secondary-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search your clothes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {["All", "Tops", "Bottoms", "Dresses", "Shoes", "Accessories","Watch",].map(x =>
            <option key={x}>{x}</option>
          )}
        </select>
      </div>

      <div className="clothing-grid">
        {filteredClothes.map(renderClothingCard)}
      </div>

      {!filteredClothes.length && (
        <p className="empty-message">No clothing items found.</p>
      )}
    </>
  );

  const renderStudio = () => (
    <>
      <div className="section-heading">
        <div>
          <span className="eyebrow">MIX & MATCH</span>
          <h2>Outfit Studio</h2>
          <p className="muted">Create a look that feels like you.</p>
        </div>
      </div>

      <div className="studio-layout">
        <div className="studio-preview">
          <span className="eyebrow">YOUR NEW LOOK</span>
          <h3>Outfit Preview</h3>

          <div className="preview-model">
            {["Tops", "Bottoms", "Shoes"].map(type => {
              const item = getItem(selected[type]);

              return (
                <div className="preview-piece" key={type}>
                  {item ? (
                    item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : item.emoji
                  ) : (
                    type === "Tops" ? "👚" : type === "Bottoms" ? "👖" : "👟"
                  )}
                  <small>{item ? item.name : `Choose ${type}`}</small>
                </div>
              );
            })}
          </div>

          <button className="primary-btn full-btn" onClick={saveOutfit}>
            ♡ Save This Outfit
          </button>
        </div>

        <div className="studio-options">
          {["Tops", "Bottoms", "Shoes"].map(type => (
            <div className="select-group" key={type}>
              <label>{type}</label>
              <select
                value={selected[type]}
                onChange={(e) => setSelected({ ...selected, [type]: e.target.value })}
              >
                <option value="">Select {type}</option>
                {clothes.filter(x => x.category === type).map(item =>
                  <option key={item.id} value={item.id}>{item.name}</option>
                )}
              </select>
            </div>
          ))}
          <p className="muted">Add more clothes to create different combinations.</p>
        </div>
      </div>

      <div className="section-heading"><h2>Your Saved Looks</h2></div>
      <div className="outfit-grid">{outfits.map(renderOutfitCard)}</div>
    </>
  );

  const renderPlanner = () => (
    <>
      <div className="section-heading">
        <div>
          <span className="eyebrow">PLAN YOUR STYLE</span>
          <h2>Outfit Planner</h2>
          <p className="muted">Plan your outfits for the week.</p>
        </div>
      </div>

      <div className="planner-grid">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
          <div className="planner-card" key={day}>
            <h3>{day}</h3>
            <select
              value={planner[day] || ""}
              onChange={(e) => setPlanner({ ...planner, [day]: e.target.value })}
            >
              <option value="">Choose an outfit</option>
              {outfits.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
            <p>
              {outfits.find(x => x.id === Number(planner[day]))?.name || "No outfit planned"}
            </p>
          </div>
        ))}
      </div>
    </>
  );

  const renderProfile = () => (
    <>
      <div className="section-heading"><h2>My Profile</h2></div>

      <form
        className="profile-card"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Profile updated successfully!");
        }}
      >
        <div className="profile-avatar">👩🏻</div>
        <h3>Personal Details</h3>

        <label>Your Name</label>
        <input
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />

        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />

        <button className="primary-btn">Update Profile</button>
      </form>
    </>
  );

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">✿</span>
          <div>
            <h2>StyleMate<span>.</span></h2>
            <small>YOUR VIRTUAL WARDROBE</small>
          </div>
        </div>

        <p className="nav-label">MENU</p>

        <nav>
          {menu.map(([name, icon]) => (
            <button
              key={name}
              className={`nav-link ${page === name ? "active" : ""}`}
              onClick={() => {
                setPage(name);
                setSearch("");
                setCategory("All");
                setShowForm(false);
              }}
            >
              <span>{icon}</span>{name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <span>✧</span>
          <p>Dress well. Feel amazing.</p>
          <small>Style is your story.</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="muted">YOUR STYLE JOURNEY</p>
            <h2>Welcome, {profile.name || "Fashion Lover"}! ✨</h2>
          </div>
          <button className="top-avatar" onClick={() => setPage("Profile")}>👩🏻</button>
        </header>

        <div className="page-content">
          {page === "Dashboard" && renderDashboard()}
          {(page === "My Wardrobe" || page === "My Favorites") && renderWardrobe()}
          {page === "Outfit Studio" && renderStudio()}
          {page === "Outfit Planner" && renderPlanner()}
          {page === "Profile" && renderProfile()}
        </div>

        <footer>Made with ♡ by StyleMate | © 2026</footer>
      </main>
    </div>
  );
}

export default App;
