declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_master_edition_v3, create_metadata_accounts_v3, CreateMasterEditionV3,
        CreateMetadataAccountsV3, Metadata,
    },
    token::{burn, mint_to, Burn, Mint, MintTo, Token, TokenAccount},
};
use mpl_token_metadata::{
    pda::{find_master_edition_account, find_metadata_account},
    state::DataV2,
};

#[program]
pub mod happi_nft {

    use super::*;

    #[derive(Accounts)]
    pub struct InitNFT<'info> {
        #[account(mut, signer)]
        pub signer: AccountInfo<'info>,
        #[account(
            init,
            payer = signer,
            mint::decimals = 0,
            mint::authority = signer.key(),
            mint::freeze_authority = signer.key(),
        )]
        pub mint: Account<'info, Mint>,
        #[account(
            init_if_needed,
            payer = signer,
            associated_token::mint = mint,
            associated_token::authority = signer
        )]
        pub associated_token_account: Account<'info, TokenAccount>,
        #[account(
            mut,
            address=find_metadata_account(&mint.key()).0,
        )]
        pub metadata_account: AccountInfo<'info>,
        #[account(
            mut,
            address=find_master_edition_account(&mint.key()).0,
        )]
        pub master_edition_account: AccountInfo<'info>,
        pub token_program: Program<'info, Token>,
        pub associated_token_program: Program<'info, AssociatedToken>,
        pub token_metadata_program: Program<'info, Metadata>,
        pub system_program: Program<'info, System>,
        pub rent: Sysvar<'info, Rent>,
    }

    pub fn init_nft(
        ctx: Context<InitNFT>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        let cpi_context = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.associated_token_account.to_account_info(),
                authority: ctx.accounts.signer.to_account_info(),
            },
        );

        mint_to(cpi_context, 1)?;

        let cpi_context = CpiContext::new(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                mint_authority: ctx.accounts.signer.to_account_info(),
                update_authority: ctx.accounts.signer.to_account_info(),
                payer: ctx.accounts.signer.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        );

        let data_v2 = DataV2 {
            name: name.clone(),
            symbol: symbol.clone(),
            uri: uri.clone(),
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        };

        create_metadata_accounts_v3(cpi_context, data_v2, false, true, None)?;

        let cpi_context = CpiContext::new(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMasterEditionV3 {
                edition: ctx.accounts.master_edition_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                update_authority: ctx.accounts.signer.to_account_info(),
                mint_authority: ctx.accounts.signer.to_account_info(),
                payer: ctx.accounts.signer.to_account_info(),
                metadata: ctx.accounts.metadata_account.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        );

        create_master_edition_v3(cpi_context, None)?;

        Ok(())
    }

    pub fn feed(ctx: Context<Feed>) -> ProgramResult {
        let current_time = Clock::get()?.unix_timestamp;
        let mut tamagotchi_data = ctx.accounts.tamagotchi_data.load_mut()?;
        tamagotchi_data.last_feed_date = current_time;
        Ok(())
    }

    pub fn burn_if_not_fed_for_3_days(ctx: Context<BurnIfNotFedFor3Days>) -> ProgramResult {
        // Load the tamagotchi data account
        let tamagotchi_data = &mut ctx.accounts.tamagotchi_data.load_mut()?;

        // Get the current UNIX timestamp
        let current_time = Clock::get()?.unix_timestamp;

        // Calculate the difference between the current time and the last feed date
        let time_since_last_feed = current_time - tamagotchi_data.last_feed_date;

        // Check if it has been more than 3 days (259200 seconds)
        if time_since_last_feed > 259200 {
            // Burn the NFT if it has not been fed for 3 days
            let incinerator_address = "1nc1nerator11111111111111111111111111111111".parse()?;
            let cpi_accounts = anchor_spl::token::Burn {
                mint: ctx.accounts.mint.to_account_info(), // Assuming this is the NFT mint account
                authority: ctx.accounts.authority.to_account_info(),
            };
            anchor_spl::token::burn(cpi_accounts, Some(incinerator_address))?;
        }

        Ok(())
    }

    #[derive(Accounts)]
    pub struct BurnIfNotFedFor3Days<'info> {
        #[account(mut)]
        pub tamagotchi_data: Account<'info, TamagotchiData>,
        pub mint: AccountInfo<'info>,
        pub authority: AccountInfo<'info>,
    }

    #[derive(Accounts)]
    pub struct Feed<'info> {
        #[account(mut)]
        pub tamagotchi_data: Account<'info, TamagotchiData>,
    }

    #[account]
    pub struct TamagotchiData {
        pub last_feed_date: i64,
    }

    #[derive(Accounts)]
    pub struct BurnNFT<'info> {
        #[account(signer)]
        pub authority: AccountInfo<'info>,
        #[account(mut)]
        pub mint: Account<'info, Mint>,
        pub token_program: Program<'info, Token>,
    }
}

