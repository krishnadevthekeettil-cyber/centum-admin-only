
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  AlertTriangle,
  Printer
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TableName } from '../types';
import AdmissionPrintForm from '../components/AdmissionPrintForm';

interface GenericManagementViewProps {
  tableName: TableName;
}

const GenericManagementView: React.FC<GenericManagementViewProps> = ({ tableName }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [printingItem, setPrintingItem] = useState<any>(null);

  // Define table structures for forms and display
  const tableConfig: Record<TableName, { columns: string[], displayNames: string[], formFields: {name: string, type: string, label: string}[] }> = {
    centum_news: {
      columns: ['title', 'category', 'display_date', 'is_urgent'],
      displayNames: ['Title', 'Category', 'Date', 'Urgent'],
      formFields: [
        { name: 'title', type: 'text', label: 'News Title' },
        { name: 'excerpt', type: 'textarea', label: 'Summary' },
        { name: 'image_url', type: 'text', label: 'Image URL' },
        { name: 'category', type: 'text', label: 'Category' },
        { name: 'display_date', type: 'text', label: 'Display Date (e.g. Oct 29, 2024)' },
        { name: 'read_more_url', type: 'text', label: 'Read More Link' },
        { name: 'is_urgent', type: 'checkbox', label: 'Mark as Urgent' },
      ]
    },
    centum_blogs: {
      columns: ['title', 'author', 'category', 'read_time'],
      displayNames: ['Title', 'Author', 'Category', 'Read Time'],
      formFields: [
        { name: 'title', type: 'text', label: 'Blog Title' },
        { name: 'slug', type: 'text', label: 'Slug (unique URL path)' },
        { name: 'excerpt', type: 'textarea', label: 'Short Preview' },
        { name: 'author', type: 'text', label: 'Author Name' },
        { name: 'category', type: 'text', label: 'Category' },
        { name: 'image_url', type: 'text', label: 'Thumbnail URL' },
        { name: 'display_date', type: 'text', label: 'Date' },
        { name: 'read_time', type: 'text', label: 'Read Time (e.g. 8 min)' },
        { name: 'content_html', type: 'textarea', label: 'Article Content (HTML/Markdown)' },
      ]
    },
    centum_results: {
      columns: ['student_name', 'exam_type', 'rank', 'exam_year'],
      displayNames: ['Student Name', 'Exam', 'Rank', 'Year'],
      formFields: [
        { name: 'student_name', type: 'text', label: 'Student Name' },
        { name: 'exam_type', type: 'text', label: 'Exam Type (JEE/NEET)' },
        { name: 'rank', type: 'text', label: 'Rank achieved' },
        { name: 'score', type: 'text', label: 'Score/Percentile' },
        { name: 'achievement', type: 'text', label: 'Specific Achievement' },
        { name: 'exam_year', type: 'number', label: 'Year' },
        { name: 'image_url', type: 'text', label: 'Student Photo URL' },
      ]
    },
    centum_announcements: {
      columns: ['title', 'priority', 'created_at'],
      displayNames: ['Title', 'Priority', 'Posted Date'],
      formFields: [
        { name: 'title', type: 'text', label: 'Announcement Title' },
        { name: 'description', type: 'textarea', label: 'Short Description' },
        { name: 'read_more_url', type: 'text', label: 'Action URL' },
        { name: 'priority', type: 'number', label: 'Priority (High numbers first)' },
      ]
    },
    centum_subscribers: {
      columns: ['email', 'created_at'],
      displayNames: ['Subscriber Email', 'Subscribed On'],
      formFields: [
        { name: 'email', type: 'email', label: 'Email Address' },
      ]
    },
    centumbrosher: {
      columns: ['id', 'description', 'created_at'],
      displayNames: ['ID', 'Description', 'Added At'],
      formFields: [
        { name: 'description', type: 'textarea', label: 'Brochure Description' },
        { name: 'image_url', type: 'text', label: 'Image URL' },
      ]
    },
    centum_enquiries: {
      columns: ['student_name', 'mobile_number', 'class_level', 'location', 'created_at'],
      displayNames: ['Student Name', 'Mobile', 'Class', 'Location', 'Date'],
      formFields: [
        { name: 'student_name', type: 'text', label: 'Student Name' },
        { name: 'mobile_number', type: 'text', label: 'Mobile Number' },
        { name: 'class_level', type: 'text', label: 'Class Level' },
        { name: 'location', type: 'text', label: 'Location' },
      ]
    },
    centum_admissions: {
      columns: ['student_name', 'class_category', 'mobile_whatsapp', 'created_at'],
      displayNames: ['Student Name', 'Class', 'Mobile', 'Applied Date'],
      formFields: [
        { name: 'class_category', type: 'text', label: 'Class Category (VIII, IX, X, +1, +2)' },
        { name: 'class_medium', type: 'text', label: 'Medium (MM, EM)' },
        { name: 'student_name', type: 'text', label: 'Student Name' },
        { name: 'student_name_malayalam', type: 'text', label: 'Student Name (Malayalam)' },
        { name: 'school_name', type: 'text', label: 'School Name' },
        { name: 'gender', type: 'text', label: 'Gender (male/female)' },
        { name: 'dob_day', type: 'number', label: 'DOB Day' },
        { name: 'dob_month', type: 'number', label: 'DOB Month' },
        { name: 'dob_year', type: 'number', label: 'DOB Year' },
        { name: 'father_name', type: 'text', label: 'Father\'s Name' },
        { name: 'father_occupation', type: 'text', label: 'Father\'s Occupation' },
        { name: 'mother_name', type: 'text', label: 'Mother\'s Name' },
        { name: 'mother_occupation', type: 'text', label: 'Mother\'s Occupation' },
        { name: 'address', type: 'textarea', label: 'Address' },
        { name: 'pin_code', type: 'text', label: 'PIN Code' },
        { name: 'mobile_whatsapp', type: 'text', label: 'WhatsApp Mobile' },
        { name: 'mobile_secondary', type: 'text', label: 'Secondary Mobile' },
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'relation_with_centum', type: 'text', label: 'Relation with Centum' },
        { name: 'preferred_batch', type: 'text', label: 'Preferred Batch (morning/holiday)' },
      ]
    }
  };

  const config = tableConfig[tableName];

  const fetchData = async () => {
    setLoading(true);
    const { data: result, error: fetchError } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setData(result || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [tableName]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload: any = {};
    
    config.formFields.forEach(field => {
      if (field.type === 'checkbox') {
        payload[field.name] = formData.get(field.name) === 'on';
      } else if (field.type === 'number') {
        payload[field.name] = Number(formData.get(field.name));
      } else {
        payload[field.name] = formData.get(field.name);
      }
    });

    try {
      if (editingItem) {
        const { error: updateError } = await supabase
          .from(tableName)
          .update(payload)
          .eq('id', editingItem.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from(tableName)
          .insert([payload]);
        if (insertError) throw insertError;
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchData();
    } catch (err: any) {
      alert(`Error saving: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', itemToDelete.id);
      
      if (deleteError) throw deleteError;
      
      setItemToDelete(null);
      fetchData();
    } catch (err: any) {
      alert(`Error deleting: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrint = (item: any) => {
    setPrintingItem(item);
  };

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 print:p-0 print:m-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 capitalize">
            {tableName.replace('centum_', '').replace('centumbrosher', 'Brochures')}
          </h1>
          <p className="text-slate-500 text-sm">Manage entries for this section</p>
        </div>
        <button 
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          <Plus className="w-4 h-4" />
          Add New Entry
        </button>
      </div>

      {/* Table Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-4 items-center print:hidden">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder={tableName.includes('admissions') || tableName.includes('enquiries') ? "Search by name, mobile, etc..." : "Search records..."}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            Export
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                {config.displayNames.map(name => (
                  <th key={name} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {name}
                  </th>
                ))}
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={config.columns.length + 1} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <p className="text-sm">Loading records...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={config.columns.length + 1} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 bg-slate-100 rounded-full">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium">No records found</p>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="text-indigo-600 text-xs font-bold hover:underline"
                      >
                        Clear search
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    {config.columns.map(col => (
                      <td key={`${item.id}-${col}`} className="px-6 py-4 whitespace-nowrap">
                        {col === 'created_at' ? (
                          <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(item[col]).toLocaleDateString()}
                          </div>
                        ) : col === 'is_urgent' ? (
                          item[col] ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <AlertCircle className="w-3 h-3" />
                              Urgent
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">Standard</span>
                          )
                        ) : (
                          <div className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                            {String(item[col])}
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {tableName === 'centum_admissions' && (
                          <button 
                            onClick={() => handlePrint(item)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Print Application"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setItemToDelete(item)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between text-xs font-medium text-slate-500">
          <p>Showing {filteredData.length} of {data.length} entries</p>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1 bg-white border border-slate-200 rounded-md disabled:opacity-50">Prev</button>
            <button disabled className="px-3 py-1 bg-white border border-slate-200 rounded-md disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {editingItem ? 'Edit Entry' : 'Add New Entry'}
                </h3>
                <p className="text-slate-500 text-xs mt-1">Fill in the details below</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              {config.formFields.map((field) => (
                <div key={field.name} className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 block">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      name={field.name}
                      defaultValue={editingItem ? editingItem[field.name] : ''}
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                    />
                  ) : field.type === 'checkbox' ? (
                    <div className="flex items-center gap-3 py-2">
                      <input 
                        type="checkbox"
                        name={field.name}
                        defaultChecked={editingItem ? editingItem[field.name] : false}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-600">Enable this option</span>
                    </div>
                  ) : (
                    <input 
                      type={field.type}
                      name={field.name}
                      defaultValue={editingItem ? editingItem[field.name] : ''}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                      required={field.type !== 'text'}
                    />
                  )}
                </div>
              ))}
              
              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  {editingItem ? 'Update Entry' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-red-50 text-red-600 rounded-full">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
                <p className="text-slate-500 text-sm">
                  Are you sure you want to delete this entry? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                disabled={isDeleting}
              >
                No, Keep it
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print View - Hidden except during print */}
      {printingItem && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm overflow-auto print:static print:bg-transparent print:backdrop-blur-none">
          <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 print:p-0">
            <div className="w-full max-w-[210mm] mb-6 flex items-center justify-between bg-white p-4 rounded-2xl shadow-xl print:hidden">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Print Preview</h3>
                  <p className="text-slate-500 text-xs">Ensure your printer is connected and turned on</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setPrintingItem(null)}
                  className="px-6 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Now
                </button>
              </div>
            </div>
            
            <div className="bg-white shadow-2xl print:shadow-none">
              <AdmissionPrintForm data={printingItem} />
            </div>
            
            <div className="mt-8 text-white/50 text-sm print:hidden">
              Press Esc or click Cancel to exit preview
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericManagementView;
