use anchor_lang::prelude::*;
use anchor_spl::token;
use anchor_spl::token::{MintTo, Token, Transfer};
use std::time::{SystemTime, UNIX_EPOCH};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod happi_cat_nft {
    use super::*;

    pub fn mint_happi_cat_nft(ctx: Context<MintHappiCatNFT>) -> Result<()> {
        // Create the MintTo struct for our context
        let cpi_accounts = MintTo {
            mint: ctx.accounts.happi_cat_nft.to_account_info(),
            to: ctx.accounts.happi_cat_nft_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        // Create the CpiContext we need for the request
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        // Execute anchor's helper function to mint tokens
        token::mint_to(cpi_ctx, 10)?;

        // Set the last_feed_date to the current date
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        ctx.accounts.happi_cat_nft_account.last_feed_date = Some(now);

        Ok(())
    }

    pub fn feed(ctx: Context<Feed>, _amount: u64) -> Result<()> {
        // Update the last_feed_date
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        ctx.accounts.happi_cat_nft_account.last_feed_date = Some(now);
        Ok(())
    }

    pub fn transfer_happi_cat_nft(ctx: Context<TransferHappiCatNFT>) -> Result<()> {
        // Create the Transfer struct for our context
        let transfer_instruction = Transfer {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.from_authority.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        // Create the Context for our Transfer request
        let cpi_ctx = CpiContext::new(cpi_program, transfer_instruction);

        // Execute anchor's helper function to transfer tokens
        anchor_spl::token::transfer(cpi_ctx, 5)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintHappiCatNFT<'info> {
    ///CHECK: This is the token that we want to mint
    #[account(mut)]
    pub happi_cat_nft: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token>,
    ///CHECK: This is the token account that we want to mint tokens to
    #[account(mut)]
    pub happi_cat_nft_account: Box<Account<'info, HappiCatNFTAccount>>,
    ///CHECK: The authority of the mint account
    #[account(mut)]
    pub authority: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct TransferHappiCatNFT<'info> {
    pub token_program: Program<'info, Token>,
    ///CHECK: The associated token account that we are transferring the token from
    #[account(mut)]
    pub from: UncheckedAccount<'info>,
    ///CHECK: The associated token account that we are transferring the token to
    #[account(mut)]
    pub to: AccountInfo<'info>,
    //CHECK: The authority of the from account
    pub from_authority: Signer<'info>,
}

#[account]
pub struct HappiCatNFTAccount {
    pub last_feed_date: Option<u64>,
}

#[derive(Accounts)]
pub struct Feed<'info> {
    #[account(mut)]
    pub happi_cat_nft_account: Box<Account<'info, HappiCatNFTAccount>>,
}
