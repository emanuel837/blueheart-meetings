import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { addClientTag, updateClientColor } from '../../../firebase/clients';
import {
  aggregateClients,
  filterClients,
  formatLastMeeting,
  getClientBaseData,
  getClientMeetings,
} from '../../../utils/clients';
import ClientHistoryModal from './ClientHistoryModal';
import ColorPicker from './ColorPicker';

function ClientsTab({ meetings, clientsMeta }) {
  const [search, setSearch] = useState('');
  const [colorPickerId, setColorPickerId] = useState(null);
  const [tagInputs, setTagInputs] = useState({});
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const clients = useMemo(
    () => aggregateClients(meetings, clientsMeta),
    [meetings, clientsMeta]
  );

  const filteredClients = useMemo(
    () => filterClients(clients, search),
    [clients, search]
  );

  const selectedClientMeetings = useMemo(
    () => (selectedClient ? getClientMeetings(meetings, selectedClient) : []),
    [meetings, selectedClient]
  );

  async function handleColorChange(client, color) {
    setSavingId(client.id);
    try {
      await updateClientColor(client.id, color, getClientBaseData(client));
    } finally {
      setSavingId(null);
    }
  }

  async function handleAddTag(client) {
    const tag = tagInputs[client.id] || '';
    if (!tag.trim()) return;

    setSavingId(client.id);
    try {
      await addClientTag(client.id, tag, getClientBaseData(client));
      setTagInputs((prev) => ({ ...prev, [client.id]: '' }));
    } finally {
      setSavingId(null);
    }
  }

  function openClientModal(client) {
    setSelectedClient(client);
    setModalOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חיפוש לפי שם או טלפון..."
          className="w-full rounded-lg border border-gray-300 py-2.5 ps-10 pe-4 text-sm outline-none focus:border-[#233667]"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <th className="px-4 py-3 text-right font-medium w-10">צבע</th>
              <th className="px-4 py-3 text-right font-medium">שם</th>
              <th className="px-4 py-3 text-right font-medium">טלפון</th>
              <th className="px-4 py-3 text-right font-medium">אימייל</th>
              <th className="px-4 py-3 text-right font-medium">מס׳ פגישות</th>
              <th className="px-4 py-3 text-right font-medium">פגישה אחרונה</th>
              <th className="px-4 py-3 text-right font-medium">תגיות</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                  לא נמצאו לקוחות
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => openClientModal(client)}
                  className="border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer"
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="relative">
                      <button
                        type="button"
                        disabled={savingId === client.id}
                        onClick={() =>
                          setColorPickerId(colorPickerId === client.id ? null : client.id)
                        }
                        className="h-5 w-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 disabled:opacity-50"
                        style={{ backgroundColor: client.color }}
                        aria-label="בחירת צבע"
                      />
                      {colorPickerId === client.id && (
                        <ColorPicker
                          color={client.color}
                          onChange={(color) => handleColorChange(client, color)}
                          onClose={() => setColorPickerId(null)}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{client.fullName}</td>
                  <td className="px-4 py-3" dir="ltr">
                    {client.phone || '—'}
                  </td>
                  <td className="px-4 py-3" dir="ltr">
                    {client.email || '—'}
                  </td>
                  <td className="px-4 py-3 text-center">{client.meetingCount}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatLastMeeting(client.lastMeeting)}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {client.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#233667]/10 px-2 py-0.5 text-xs text-[#233667]"
                        >
                          {tag}
                        </span>
                      ))}
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={tagInputs[client.id] || ''}
                          onChange={(e) =>
                            setTagInputs((prev) => ({
                              ...prev,
                              [client.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag(client);
                            }
                          }}
                          placeholder="תגית"
                          className="w-20 rounded border border-gray-200 px-2 py-0.5 text-xs outline-none focus:border-[#233667]"
                        />
                        <button
                          type="button"
                          disabled={savingId === client.id}
                          onClick={() => handleAddTag(client)}
                          className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-[#233667] disabled:opacity-50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ClientHistoryModal
        client={selectedClient}
        meetings={selectedClientMeetings}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

export default ClientsTab;
