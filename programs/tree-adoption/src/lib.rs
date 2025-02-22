use anchor_lang::prelude::*;

declare_id!("966vnd5nGgWvrscanPzUsFcgXgGvxGDUYMmDixb8ji95");

#[program]
pub mod tree_adoption {
    use super::*;

    pub fn adopt_tree(
        ctx: Context<AdoptTree>,
        project_id: String,
        tree_count: u64,
        price: u64,
        tree_name: String,
        occasion: String,
    ) -> Result<()> {
        let adoption = &mut ctx.accounts.adoption;
        adoption.project_id = project_id;
        adoption.tree_count = tree_count;
        adoption.adopter = ctx.accounts.adopter.key();
        adoption.price = price;
        adoption.timestamp = Clock::get()?.unix_timestamp;
        adoption.tree_name = tree_name;
        adoption.occasion = occasion;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct AdoptTree<'info> {
    #[account(mut)]
    pub adoption: Account<'info, TreeAdoption>,
    #[account(mut)]
    pub adopter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct TreeAdoption {
    pub project_id: String,
    pub tree_count: u64,
    pub adopter: Pubkey,
    pub price: u64,
    pub timestamp: i64,
    pub tree_name: String,
    pub occasion: String,
} 