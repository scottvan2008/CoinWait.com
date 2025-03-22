export interface BlockHeightData {
  block_height: number
  timestamp: string
  next_halving_height: number
  blocks_remaining: number
  estimated_halving_time: string
}

export interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

export interface BitcoinStats {
  total_bitcoins_in_circulation: number
  total_bitcoins_to_ever_be_produced: number
  percentage_of_total_bitcoins_mined: number
  total_bitcoins_left_to_mine: number
  total_bitcoins_left_to_mine_until_next_blockhalf: number
  bitcoin_price_usd: number
  market_capitalization_usd: number
  bitcoins_generated_per_day: number
  bitcoins_generated_per_day_after_next_block_halving_event: number
  bitcoin_inflation_rate_per_annum: number
  bitcoin_inflation_rate_per_annum_after_next_block_halving_event: number
  bitcoin_inflation_per_day_usd: number
  bitcoin_inflation_per_day_after_next_block_halving_event_usd: number
  bitcoin_inflation_until_next_blockhalf_event_based_on_current_price_usd: number
  bitcoin_block_reward_usd: number
  total_blocks: number
  blocks_until_mining_reward_is_halved: number
  total_number_of_block_reward_halvings: number
  approximate_block_generation_time_minutes: number
  approximate_blocks_generated_per_day: number
  difficulty: number
  hash_rate_exahashes_per_second: number
  current_activated_soft_forks: string
  current_pending_soft_forks: string
  next_retarget_period_block_height: number
  blocks_to_mine_until_next_difficulty_retarget: number
  next_difficulty_retarget_eta: string
  timestamp: string
  estimated_halving_time: string
  current_block_reward: number
  next_block_reward: number
}

