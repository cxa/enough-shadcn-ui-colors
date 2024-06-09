import Demo from "./components/demo";
import Main from "./components/main";

export default function App() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("demo")) return <Demo dark={params.get("demo") === "dark"} />;

  return <Main />;
}
