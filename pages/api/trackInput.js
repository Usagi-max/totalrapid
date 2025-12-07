// netlify/functions/trackInput.js
exports.handler = async (event) => {
  const body = JSON.parse(event.body || "{}");

  console.log("INPUT LOG:", body);

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  };
};
