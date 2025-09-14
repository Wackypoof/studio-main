import { LeadsClient } from './leads-client';

export default function LeadsPage({
  searchParams,
}: {
  searchParams: { listing?: string };
}) {
  // Generate mock leads data on the server
  const leads = Array.from({ length: 15 }, (_, index) => {
    const firstNames = ['Alex', 'Jamie', 'Taylor', 'Jordan', 'Casey', 'Riley', 'Quinn', 'Avery'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia'];
    const statuses = ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost'];
    const sources = ['website', 'referral', 'social_media', 'email', 'phone'];
    const interests = ['Dental Clinic', 'Tuition Center', 'Fashion Boutique', 'Cafe', 'Manufacturing'];
    const positions = ['CEO', 'Founder', 'Director', 'Manager', 'Investor'];
    
    // Use index-based selection to ensure consistency
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[index % lastNames.length];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    
    // Use modulo to get consistent but varied values
    const status = statuses[index % statuses.length];
    const source = sources[index % sources.length];
    const interest = interests[index % interests.length];
    const position = positions[index % positions.length];
    
    // Generate a consistent phone number based on index
    const phoneSuffix = 80000000 + (index * 1234567) % 20000000;
    
    // Generate a consistent date based on index
    const daysAgo = (index * 2) % 30; // 0-29 days ago
    const lastContact = new Date();
    lastContact.setDate(lastContact.getDate() - daysAgo);
    
    return {
      id: `lead_${index + 1}`,
      name,
      email,
      phone: `+65 ${phoneSuffix}`,
      company: `Company ${String.fromCharCode(65 + index)}`,
      position,
      status,
      source,
      interest,
      lastContact: lastContact.toISOString()
    };
  });
  
  // Calculate status counts
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Pass the data to the client component
  return (
    <LeadsClient 
      initialData={{
        leads,
        statusCounts
      }} 
      searchParams={searchParams} 
    />
  );
}
