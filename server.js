const express = require("express");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

const USER = { username: "Viki", password: "Viki0314" };

app.use(express.json());
app.use(session({
  secret: "crispycomet_demo_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));

app.use(express.static("public"));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === USER.username && password === USER.password) {
    req.session.user = username;
    return res.json({ ok: true, user: username });
  }
  return res.status(401).json({ ok: false, error: "Hibás felhasználónév vagy jelszó." });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/me", (req, res) => {
  if (!req.session.user) return res.status(401).json({ ok: false });
  res.json({ ok: true, user: req.session.user });
});

app.listen(PORT, () => console.log(`Szerver fut: http://localhost:${PORT}`));
