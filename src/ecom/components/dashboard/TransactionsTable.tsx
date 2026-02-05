type Row = {
  property: string
  type: string
  transaction: 'Buy' | 'Rent'
  customer: string
  date: string
  status: 'CANCEL' | 'COMPLETED'
}

const rows: Row[] = [
  { property: 'New York', type: 'House', transaction: 'Buy', customer: 'Thomas L. Fletcher', date: 'Jan, 31, 2025', status: 'CANCEL' },
  { property: 'Washington Residence', type: 'Villa', transaction: 'Rent', customer: 'David Lee', date: 'Jan, 30, 2025', status: 'COMPLETED' },
  { property: 'London Residence', type: 'House', transaction: 'Buy', customer: 'Eleana Porana', date: 'Jan, 30, 2025', status: 'CANCEL' },
  { property: 'Grand Resort Villa', type: 'Villa', transaction: 'Rent', customer: 'Mike Hussey', date: 'Jan, 30, 2025', status: 'COMPLETED' }
]

export default function TransactionsTable() {
  return (
    <div className="surface table-card">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px' }}>
        <div className="title">Recent Transaction History</div>
        <select className="select" defaultValue="last-month">
          <option value="last-month">Last Month</option>
          <option value="this-month">This Month</option>
        </select>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Properties Name</th>
            <th>Properties Type</th>
            <th>Transaction</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx}>
              <td>{r.property}</td>
              <td>{r.type}</td>
              <td>{r.transaction}</td>
              <td>{r.customer}</td>
              <td>{r.date}</td>
              <td>{r.status === 'COMPLETED' ? <span className="badge green">COMPLETED</span> : <span className="badge red">CANCEL</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

