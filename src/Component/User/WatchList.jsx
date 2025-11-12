import { supabase } from "../../supabaseClient";
import "./WatchList.scss";
const WatchlistDropdown = ({
  user,
  watchlists,
  setWatchlists,
  selectedList,
  setSelectedList,
}) => {
  // 🟢 Hàm chọn danh sách
  const handleSelect = (e) => {
    const list = watchlists.find((l) => l.id === e.target.value);
    setSelectedList(list || null);
  };

  // 🟢 Hàm tạo danh sách mới
  const handleCreate = async () => {
    const name = prompt("Nhập tên danh sách mới:");
    if (!name?.trim()) return;

    const { data, error } = await supabase
      .from("watchlists")
      .insert([{ user_id: user.id, name: name.trim() }])
      .select();

    if (error) {
      console.error(error);
      alert("Không thể tạo danh sách mới.");
      return;
    }

    const newList = data[0];
    setWatchlists((prev) => [...prev, newList]);
    setSelectedList(newList);
  };

  return (
    <div className="watchlist-dropdown">
      <select value={selectedList?.id || ""} onChange={handleSelect}>
        <option value="">-- Chọn danh sách --</option>
        {watchlists.map((list) => (
          <option key={list.id} value={list.id}>
            {list.name}
          </option>
        ))}
      </select>

      <button onClick={handleCreate}>+</button>
    </div>
  );
};

export default WatchlistDropdown;
