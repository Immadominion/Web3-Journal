use anchor_lang::prelude::*;

declare_id!("7ye3d3zdux6TAnMrrzW3PeKCXc5FeG7kqcTvJNUwTr6E");

#[program]
mod journal {
    use super::*;

    pub fn create_journal_entry(
        ctx: Context<CreateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        // Validate title length before using it as a seed
        if title.len() > 50 {
            return Err(error!(JournalError::TitleTooLong));
        }
        if message.len() > 1000 {
            return Err(error!(JournalError::MessageTooLong));
        }

        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.owner = ctx.accounts.owner.key();
        journal_entry.title = title;
        journal_entry.message = message;

        msg!("Journal Entry Created");
        msg!("Title: {}", journal_entry.title);
        msg!("Message: {}", journal_entry.message);

        Ok(())
    }

    pub fn update_journal_entry(
        ctx: Context<UpdateEntry>,
        _title: String,
        message: String,
    ) -> Result<()> {
        if message.len() > 1000 {
            return Err(error!(JournalError::MessageTooLong));
        }

        let journal_entry = &mut ctx.accounts.journal_entry;

        // Ensure only the owner can update
        require_keys_eq!(
            journal_entry.owner,
            ctx.accounts.owner.key(),
            JournalError::Unauthorized
        );

        journal_entry.message = message;
        msg!("Journal Entry Updated");

        Ok(())
    }

    pub fn delete_journal_entry(ctx: Context<DeleteEntry>, _title: String) -> Result<()> {
        // Ensure only the owner can delete
        require_keys_eq!(
            ctx.accounts.journal_entry.owner,
            ctx.accounts.owner.key(),
            JournalError::Unauthorized
        );

        msg!("Journal entry deleted");
        Ok(())
    }
}

#[account]
pub struct JournalEntryState {
    pub owner: Pubkey,
    pub title: String,
    pub message: String,
}

#[derive(Accounts)]
#[instruction(title: String, message: String)]
pub struct CreateEntry<'info> {
    #[account(
        init,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        payer = owner,
        space = 8 + 32 + 4 + 50 + 4 + 1000,
    )]
    pub journal_entry: Account<'info, JournalEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String, message: String)]
pub struct UpdateEntry<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
    )]
    pub journal_entry: Account<'info, JournalEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteEntry<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        close = owner,
    )]
    pub journal_entry: Account<'info, JournalEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum JournalError {
    #[msg("Title length exceeds 50 characters.")]
    TitleTooLong,
    #[msg("Message length exceeds 1000 characters.")]
    MessageTooLong,
    #[msg("Unauthorized access.")]
    Unauthorized,
}
