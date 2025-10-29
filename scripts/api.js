export async function fetchTasks() {
  try {
    const res = await fetch("./data.json");
    if (!res.ok) throw new Error(`Ошибка сети: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    alert("Не удалось загрузить задачи");
    return [];
  }
}
