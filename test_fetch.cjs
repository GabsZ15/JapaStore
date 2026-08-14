fetch('http://localhost:3000/api/shipping/calculate', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({ destinationCep: "01001000" })
})
.then(res => res.text().then(t => ({ok: res.ok, status: res.status, type: res.headers.get("content-type"), body: t})))
.then(console.log)
.catch(console.error);
