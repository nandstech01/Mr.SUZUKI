import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface ContractRow {
  id: string
  status: string
  monthly_fee_yen: number
  platform_fee_rate: number
  start_date: string
  end_date: string | null
  created_at: string
  company_profiles: { company_name: string }
  engineer_profiles: { profiles: { display_name: string } }
}

interface InvoiceRow {
  id: string
  contract_id: string
  amount_yen: number
  status: string
  billing_month: string
  contracts: { company_profiles: { company_name: string } }
}

export async function GET(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single<{ role: string }>()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 })
  }

  try {
    // Fetch contracts
    let contractsQuery = supabase
      .from('contracts')
      .select(`
        id,
        status,
        monthly_fee_yen,
        platform_fee_rate,
        start_date,
        end_date,
        created_at,
        company_profiles!inner(company_name),
        engineer_profiles!inner(
          owner_id,
          profiles:owner_id(display_name)
        )
      `)
      .order('created_at', { ascending: false })

    if (status) {
      contractsQuery = contractsQuery.eq('status', status)
    }

    const { data: contracts, error: contractsError } = await contractsQuery as { data: ContractRow[] | null, error: Error | null }

    if (contractsError) throw contractsError

    const formattedContracts = contracts?.map(contract => ({
      id: contract.id,
      company_name: contract.company_profiles.company_name,
      engineer_name: contract.engineer_profiles.profiles.display_name,
      status: contract.status,
      monthly_fee_yen: contract.monthly_fee_yen,
      platform_fee_rate: contract.platform_fee_rate,
      start_date: contract.start_date,
      end_date: contract.end_date,
      created_at: contract.created_at,
    })) || []

    // Fetch invoices
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select(`
        id,
        contract_id,
        amount_yen,
        status,
        billing_month,
        contracts!inner(
          company_profiles!inner(company_name)
        )
      `)
      .order('created_at', { ascending: false }) as { data: InvoiceRow[] | null, error: Error | null }

    if (invoicesError) throw invoicesError

    const formattedInvoices = invoices?.map(invoice => ({
      id: invoice.id,
      contract_id: invoice.contract_id,
      amount_yen: invoice.amount_yen,
      status: invoice.status,
      billing_month: invoice.billing_month,
      company_name: invoice.contracts.company_profiles.company_name,
    })) || []

    return NextResponse.json({
      contracts: formattedContracts,
      invoices: formattedInvoices,
    })
  } catch (error) {
    console.error('Contracts fetch error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
