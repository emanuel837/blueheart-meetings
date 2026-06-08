import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ClientsTab from '../../components/admin/meetings/ClientsTab';
import MeetingsTab from '../../components/admin/meetings/MeetingsTab';
import { subscribeToBranches } from '../../firebase/branches';
import { subscribeToClients } from '../../firebase/clients';
import { subscribeToMeetings } from '../../firebase/meetings';

const TABS = [
  { id: 'meetings', label: 'פגישות' },
  { id: 'clients', label: 'לקוחות' },
];

function Meetings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'clients' ? 'clients' : 'meetings';

  const [meetings, setMeetings] = useState([]);
  const [branches, setBranches] = useState([]);
  const [clientsMeta, setClientsMeta] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let meetingsReady = false;
    let branchesReady = false;
    let clientsReady = false;

    function checkReady() {
      if (meetingsReady && branchesReady && clientsReady) setLoading(false);
    }

    const unsubMeetings = subscribeToMeetings((data) => {
      setMeetings(data);
      meetingsReady = true;
      checkReady();
    });

    const unsubBranches = subscribeToBranches((data) => {
      setBranches(data);
      branchesReady = true;
      checkReady();
    });

    const unsubClients = subscribeToClients((data) => {
      setClientsMeta(data);
      clientsReady = true;
      checkReady();
    });

    return () => {
      unsubMeetings();
      unsubBranches();
      unsubClients();
    };
  }, []);

  function setTab(tabId) {
    if (tabId === 'clients') {
      setSearchParams({ tab: 'clients' });
    } else {
      setSearchParams({});
    }
  }

  if (loading) {
    return <p className="text-center text-gray-500 py-12">טוען נתונים...</p>;
  }

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold text-[#233667]">ניהול פגישות ולקוחות</h1>

      <div className="mt-6 flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? 'border-[#233667] text-[#233667]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'meetings' ? (
          <MeetingsTab meetings={meetings} branches={branches} />
        ) : (
          <ClientsTab meetings={meetings} clientsMeta={clientsMeta} />
        )}
      </div>
    </div>
  );
}

export default Meetings;
