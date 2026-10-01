(function () {
  var $ = function (i) { return document.getElementById(i); };
  var KF = "bs_friends", KU = "bs_upi", KH = "bs_hist";

  /* ---------- storage (safe if blocked) ---------- */
  function ld(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function sv(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---------- state ---------- */
  var friends = ld(KF, []), hist = ld(KH, []), uid = 1, last = null;
  var S = { rest: "", people: [], mode: "item", bill: "", st: "", stWho: [], items: [],
            tip: 10, cur: "₹", round: 0, upi: ld(KU, "") };

  /* ---------- helpers ---------- */
  function cents(v) { return Math.round((parseFloat(v) || 0) * 100); }
  function fmt(c, cur) { return cur + (c / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function sum(a) { return a.reduce(function (s, v) { return s + v; }, 0); }

  /* ---------- people ---------- */
  function addPerson(n) {
    n = n.trim(); if (!n) return;
    var p = { id: uid++, name: n };
    S.people.push(p); S.stWho.push(p.id);
    S.items.forEach(function (i) { i.who.push(p.id); });
    if (friends.indexOf(n) < 0) { friends.push(n); sv(KF, friends); }
    drawAll();
  }
  function removePerson(id) {
    S.people = S.people.filter(function (p) { return p.id !== id; });
    S.stWho = S.stWho.filter(function (x) { return x !== id; });
    S.items.forEach(function (i) { i.who = i.who.filter(function (x) { return x !== id; }); });
    drawAll();
  }

  /* ---------- drawing ---------- */
  function whoRow(arr) {
    var d = el("div", "who");
    S.people.forEach(function (p) {
      var l = el("label", "tick"), c = document.createElement("input");
      c.type = "checkbox"; c.checked = arr.indexOf(p.id) > -1;
      c.onchange = function () {
        var k = arr.indexOf(p.id);
        if (c.checked && k < 0) arr.push(p.id);
        if (!c.checked && k > -1) arr.splice(k, 1);
        calc();
      };
      l.appendChild(c); l.appendChild(document.createTextNode(p.name)); d.appendChild(l);
    });
    if (!S.people.length) d.appendChild(el("span", "hint", "Add people first."));
    return d;
  }
  function drawPeople() {
    var f = $("friends"); f.innerHTML = "";
    friends.filter(function (n) { return !S.people.some(function (p) { return p.name === n; }); })
      .forEach(function (n) {
        var b = el("button", "chip ghost", "+ " + n); b.type = "button";
        b.onclick = function () { addPerson(n); }; f.appendChild(b);
      });
    var q = $("people"); q.innerHTML = "";
    S.people.forEach(function (p) {
      var b = el("button", "chip", p.name + " ✕"); b.type = "button";
      b.setAttribute("aria-label", "Remove " + p.name);
      b.onclick = function () { removePerson(p.id); }; q.appendChild(b);
    });
  }
  function drawItems() {
    var box = $("items"); box.innerHTML = "";
    S.items.forEach(function (it, k) {
      var d = el("div", "dish"), r = el("div", "row");
      var n = el("input"); n.placeholder = "Dish (e.g. Starter)"; n.value = it.name; n.setAttribute("aria-label", "Dish name");
      n.oninput = function () { it.name = n.value; calc(); };
      var p = el("input"); p.type = "number"; p.inputMode = "decimal"; p.min = "0"; p.step = "0.01";
      p.placeholder = "Price"; p.value = it.price; p.style.maxWidth = "110px"; p.setAttribute("aria-label", "Dish price");
      p.oninput = function () { it.price = p.value; calc(); };
      var x = el("button", "x", "✕"); x.type = "button"; x.setAttribute("aria-label", "Remove dish");
      x.onclick = function () { S.items.splice(k, 1); drawItems(); calc(); };
      r.appendChild(n); r.appendChild(p); r.appendChild(x);
      d.appendChild(r); d.appendChild(el("div", "hint", "Who ate it?")); d.appendChild(whoRow(it.who)); box.appendChild(d);
    });
  }
  function drawMode() {
    $("whole").hidden = S.mode !== "whole"; $("byitem").hidden = S.mode !== "item";
    Array.prototype.forEach.call($("tabs").children, function (b) { b.setAttribute("aria-pressed", b.dataset.m === S.mode); });
  }
  function drawAll() { drawPeople(); drawItems(); drawMode(); calc(); }
  function setForm() {
    $("rest").value = S.rest; $("bill").value = S.bill; $("cur").value = S.cur;
    $("round").value = S.round; $("upi").value = S.upi; $("upiBox").hidden = S.cur !== "₹";
    Array.prototype.forEach.call($("tips").children, function (b) { b.setAttribute("aria-pressed", +b.dataset.t === S.tip); });
  }

  /* ---------- the maths (all in cents) ---------- */
  function calc() {
    var P = S.people, err = "", items = [];
    if (S.mode === "whole") {
      items = [{ p: cents(S.bill), who: P.map(function (p) { return p.id; }), n: "the bill" }];
    } else {
      items = S.items.map(function (i) { return { p: cents(i.price), who: i.who, n: i.name || "a dish" }; });
    }
    items = items.filter(function (i) { return i.p > 0; });
    var total = sum(items.map(function (i) { return i.p; }));
    if (!err && total && !P.length) err = "Add at least one person.";
    if (!err) items.forEach(function (i) { if (!i.who.length && !err) err = "Tick who ate " + i.n + "."; });
    $("err").textContent = err;
    if (err || !total) { $("res").hidden = true; $("acts").hidden = true; last = null; return; }

    var by = {}; P.forEach(function (p) { by[p.id] = 0; });
    items.forEach(function (i) { i.who.forEach(function (id) { by[id] += i.p / i.who.length; }); });
    var tipC = Math.round(total * S.tip / 100), grand = total + tipC;
    var raw = P.map(function (p) { return by[p.id] * grand / total; });
    var amt = raw.map(function (r) { return Math.floor(r + 1e-9); });
    var left = grand - sum(amt);
    raw.map(function (r, i) { return i; })
      .sort(function (a, b) { return (raw[b] % 1) - (raw[a] % 1); })
      .forEach(function (i, k) { if (k < left) amt[i]++; });
    var u = S.round * 100;
    if (u > 0) amt = amt.map(function (a) { return Math.ceil(a / u) * u; });
    var all = sum(amt), extra = all - grand, c = S.cur;

    $("big").textContent = fmt(all, c);
    $("sub").textContent = "incl. " + S.tip + "% tip " + fmt(tipC, c) + (extra ? " + " + fmt(extra, c) + " from rounding" : "");
    var h = $("ppl"); h.innerHTML = "";
    var rows = P.map(function (p, i) { return { name: p.name, amt: amt[i] }; });
    rows.forEach(function (r) {
      var d = el("div", "person"), rt = el("span", "rt");
      rt.appendChild(el("b", "", fmt(r.amt, c)));
      if (c === "₹" && S.upi && r.amt > 0) { var a = el("a", "upi", "Pay"); a.href = upiLink(r.amt); rt.appendChild(a); }
      d.appendChild(el("span", "", r.name)); d.appendChild(rt); h.appendChild(d);
    });
    var t = "🍽 " + (S.rest.trim() || "Bill split") + " – total " + fmt(all, c) + " (incl. " + S.tip + "% tip)\n" +
      rows.map(function (r) { return r.name + ": " + fmt(r.amt, c); }).join("\n") +
      (c === "₹" && S.upi ? "\nPay to UPI: " + S.upi : "");
    last = { text: t, total: all, n: P.length };
    $("wa").href = "https://wa.me/?text=" + encodeURIComponent(t);
    $("res").hidden = false; $("acts").hidden = false;
  }
  function upiLink(a) {
    return "upi://pay?pa=" + encodeURIComponent(S.upi) + "&pn=" + encodeURIComponent(S.upi.split("@")[0]) +
      "&am=" + (a / 100).toFixed(2) + "&cu=INR&tn=" + encodeURIComponent((S.rest.trim() || "Bill") + " split");
  }

  /* ---------- history ---------- */
  function drawHist() {
    var b = $("hist"); b.innerHTML = "";
    var now = new Date();
    var m = hist.filter(function (h) {
      var d = new Date(h.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && h.cur === S.cur;
    });
    $("month").textContent = m.length ? "This month: " + fmt(sum(m.map(function (h) { return h.total; })), S.cur) + " across " + m.length + (m.length > 1 ? " meals" : " meal") : "";
    if (!hist.length) { b.appendChild(el("div", "empty", "Nothing saved yet. Work out a split and tap Save split.")); return; }
    hist.forEach(function (h, k) {
      var d = el("div", "item"), o = el("button", "open"); o.type = "button";
      o.appendChild(el("b", "", h.name));
      o.appendChild(el("span", "", new Date(h.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) + " · " + h.n + " people · total " + fmt(h.total, h.cur)));
      o.onclick = function () {
        var u = S.upi; S = JSON.parse(JSON.stringify(h.state)); S.upi = u;
        S.people.forEach(function (p) { if (p.id >= uid) uid = p.id + 1; });
        setForm(); drawAll(); drawHist(); window.scrollTo(0, 0);
      };
      var x = el("button", "x", "✕"); x.type = "button"; x.setAttribute("aria-label", "Delete " + h.name);
      x.onclick = function () { hist.splice(k, 1); sv(KH, hist); drawHist(); };
      d.appendChild(o); d.appendChild(x); b.appendChild(d);
    });
  }

  /* ---------- events ---------- */
  $("rest").oninput = function (e) { S.rest = e.target.value; };
  $("bill").oninput = function (e) { S.bill = e.target.value; calc(); };
  $("padd").onclick = function () { addPerson($("pname").value); $("pname").value = ""; $("pname").focus(); };
  $("pname").onkeydown = function (e) { if (e.key === "Enter") $("padd").click(); };
  $("tabs").onclick = function (e) { var b = e.target.closest("button"); if (b) { S.mode = b.dataset.m; drawMode(); calc(); } };
  $("additem").onclick = function () { S.items.push({ name: "", price: "", who: S.people.map(function (p) { return p.id; }) }); drawItems(); };
  $("tips").onclick = function (e) {
    var b = e.target.closest("button"); if (!b) return;
    S.tip = +b.dataset.t; setForm(); calc();
  };
  $("cur").onchange = function (e) { S.cur = e.target.value; $("upiBox").hidden = S.cur !== "₹"; drawHist(); calc(); };
  $("round").onchange = function (e) { S.round = +e.target.value; calc(); };
  $("upi").oninput = function (e) { S.upi = e.target.value.trim(); sv(KU, S.upi); calc(); };
  $("save").onclick = function () {
    if (!last) return;
    hist.unshift({ date: new Date().toISOString(), name: S.rest.trim() || "Untitled restaurant", cur: S.cur,
                   total: last.total, n: last.n, state: JSON.parse(JSON.stringify(S)) });
    hist = hist.slice(0, 50); sv(KH, hist); drawHist();
    $("save").textContent = "Saved"; setTimeout(function () { $("save").textContent = "Save split"; }, 1500);
  };
  $("copy").onclick = function () {
    if (!last) return;
    function done() { $("copy").textContent = "Copied"; setTimeout(function () { $("copy").textContent = "Copy summary"; }, 1500); }
    function fallback() {
      var t = document.createElement("textarea"); t.value = last.text; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); done(); } catch (e) {} document.body.removeChild(t);
    }
    if (navigator.clipboard) navigator.clipboard.writeText(last.text).then(done, fallback); else fallback();
  };

  S.items.push({ name: "", price: "", who: [] });
  setForm(); drawAll(); drawHist();
})();
