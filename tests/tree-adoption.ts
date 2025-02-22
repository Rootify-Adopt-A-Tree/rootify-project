import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TreeAdoption } from "../target/types/tree_adoption";

describe("tree-adoption", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TreeAdoption as Program<TreeAdoption>;

  it("Is initialized!", async () => {
    // Add your test here
  });
}); 