const assert = require("node:assert/strict");
const test = require("node:test");

const { createPublicProfile } = require("../src/public-profile");

test("creates a public profile without private fields", () => {
  const publicProfile = createPublicProfile("user-1", {
    nome: "Profissional",
    cidade: "Recife",
    estado: "PE",
    verificationStatus: "verified",
    email: "private@example.com",
    cpf: "00000000000",
    telefone: "81999999999",
    endereco: "Rua privada"
  });

  assert.deepEqual(publicProfile, {
    id: "user-1",
    nome: "Profissional",
    cidade: "Recife",
    estado: "PE",
    verificationStatus: "verified"
  });
});

test("omits empty optional public fields", () => {
  const publicProfile = createPublicProfile("user-2", {
    nome: "Cliente",
    foto: "",
    cidade: null
  });

  assert.deepEqual(publicProfile, { id: "user-2", nome: "Cliente" });
});
