import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import AuthModal from "../components/AuthModal";
import axios from "axios";
import Swal from 'sweetalert2';

export default function AddPerson() {
  const [persons, setPersons] = useState([]);
  const [traits, setTraits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showSkinColorDropdown, setShowSkinColorDropdown] = useState(false);
  const skinColorRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    skinColor: "",
    traits: [],
    animalType: ""
  });
  const [showTraitSelector, setShowTraitSelector] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const { isAuthenticated, token } = useAuth();

  const loadData = useCallback(async () => {
    try {
      const traitsResponse = await axios.get("http://localhost:5000/api/traits");
      setTraits(traitsResponse.data);
      
      const personsResponse = await axios.get("http://localhost:5000/api/persons");
      setPersons(personsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  useEffect(() => {
    // Check if user is authenticated
    if (isAuthenticated && token) {
      // Set up axios defaults for authenticated requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Load traits and persons
      loadData();
      setShowWarning(false);
    } else {
      // User is not authenticated, clear data and show warning
      setPersons([]);
      setTraits([]);
      setShowWarning(true);
      setShowForm(false);
      setEditingPerson(null);
      
      // Clear axios auth header
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [isAuthenticated, token, loadData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (skinColorRef.current && !skinColorRef.current.contains(event.target)) {
        setShowSkinColorDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPerson) {
        // Update existing person
        await axios.put(`http://localhost:5000/api/persons/${editingPerson._id}`, formData);
      } else {
        // Create new person
        await axios.post("http://localhost:5000/api/persons", formData);
      }
      await loadData(); // Reload persons list
      setShowForm(false);
      setEditingPerson(null);
      setFormData({
        name: "",
        skinColor: "",
        traits: [],
        animalType: ""
      });
    } catch (error) {
      console.error('Error saving person:', error);
    }
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setFormData({
      name: person.name,
      skinColor: person.skinColor || "",
      traits: person.traits?.map(t => t._id) || [],
      animalType: person.animalType || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (personId, personName) => {
    const result = await Swal.fire({
      title: 'Delete Person?',
      text: `Are you sure you want to delete ${personName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#1e293b',
      color: '#f1f5f9',
      customClass: {
        popup: 'border border-red-500/20'
      }
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/persons/${personId}`);
        await loadData(); // Reload persons list
        Swal.fire({
          title: 'Deleted!',
          text: `${personName} has been deleted.`,
          icon: 'success',
          confirmButtonColor: '#f97316',
          background: '#1e293b',
          color: '#f1f5f9',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error deleting person:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete person. Please try again.',
          icon: 'error',
          confirmButtonColor: '#f97316',
          background: '#1e293b',
          color: '#f1f5f9'
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingPerson(null);
    setShowTraitSelector(false);
    setFormData({
      name: "",
      skinColor: "",
      traits: [],
      animalType: ""
    });
  };

  const handleLoginRedirect = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  if (showWarning && !isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="text-orange-500 text-4xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-orange-400 mb-4">Authentication Required</h2>
            <p className="text-slate-300 mb-6">
              You need to be logged in to add person details for personalized roasts.
            </p>
            <button
              onClick={handleLoginRedirect}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              🔥 Go to Login 🔥
            </button>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          mode="login"
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-5 sm:top-20 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-5 sm:bottom-20 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 sm:w-80 h-60 sm:h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-orange-500 text-3xl sm:text-4xl animate-bounce">👥</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent">
              Add Person
            </h1>
            <span className="text-orange-500 text-3xl sm:text-4xl animate-bounce delay-200">🔥</span>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-medium">
            Add person details to get <span className="text-orange-400 font-bold">personalized roasts</span> based on their characteristics
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg mb-6"
          >
            {editingPerson ? '✏️ Edit Person' : '➕ Add Person'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-slate-900/50 backdrop-blur-md rounded-xl p-4 sm:p-6 mb-6 border border-slate-700/50 shadow-xl relative z-[200]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Name Field */}
                <div className="lg:col-span-2">
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    <span className="text-orange-500">👤</span> Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter person's name..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-300"
                    required
                  />
                </div>
                
                {/* Skin Color Dropdown */}
                <div ref={skinColorRef}>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    <span className="text-orange-500">🎨</span> Skin Color
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowSkinColorDropdown(!showSkinColorDropdown)}
                      className="w-full p-3 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-300 text-left flex justify-between items-center hover:bg-slate-600/50"
                    >
                      <span className={formData.skinColor ? 'text-slate-100' : 'text-slate-400'}>
                        {formData.skinColor || 'Select Skin Color'}
                      </span>
                      <svg className={`w-5 h-5 text-slate-400 transform transition-transform ${showSkinColorDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Custom Dropdown */}
                    {showSkinColorDropdown && (
                      <div 
                        className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-md rounded-xl border border-slate-600/50 shadow-2xl z-[50000] max-h-60 overflow-y-auto scrollbar-hide"
                        style={{
                          scrollbarWidth: 'none', /* Firefox */
                          msOverflowStyle: 'none', /* Internet Explorer 10+ */
                        }}
                      >
                        <div className="p-2 space-y-1">
                          {['Fair', 'Light', 'Medium', 'Olive', 'Brown', 'Dark', 'Black'].map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, skinColor: color });
                                setShowSkinColorDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                                formData.skinColor === color
                                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                  : 'bg-slate-600/70 text-slate-200 hover:bg-slate-500/80 hover:text-orange-300'
                              }`}
                            >
                              {color}
                              {formData.skinColor === color && <span className="float-right">✓</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Animal Type Field */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    <span className="text-orange-500">🐾</span> Animal Type (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="What animal does this person remind you of?"
                    value={formData.animalType}
                    onChange={(e) => setFormData({ ...formData, animalType: e.target.value })}
                    className="w-full p-3 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-400 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Traits Section */}
              <div className="lg:col-span-2 mt-4 relative z-[9999]">
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  <span className="text-orange-500">🏷️</span> Traits
                </label>
                <div className="relative">{/* This div needs to be relative for the absolute positioned dropdown */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => setShowTraitSelector(!showTraitSelector)}
                      className="flex-1 p-3 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-300 text-left flex justify-between items-center hover:bg-slate-600/50"
                    >
                      <span>
                        {formData.traits.length === 0 
                          ? "Select Traits" 
                          : `${formData.traits.length} trait${formData.traits.length === 1 ? '' : 's'} selected`
                        }
                      </span>
                      <span className={`transform transition-transform text-orange-400 ${showTraitSelector ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                    
                    {formData.traits.length > 0 && (
                      <button
                        type="button"
                        onClick={async () => {
                          const result = await Swal.fire({
                            title: 'Clear All Traits?',
                            text: 'Are you sure you want to clear all selected traits?',
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#ef4444',
                            cancelButtonColor: '#6b7280',
                            confirmButtonText: 'Yes, clear all!',
                            cancelButtonText: 'Cancel',
                            background: '#1e293b',
                            color: '#f1f5f9',
                            customClass: {
                              popup: 'border border-orange-500/20'
                            }
                          });

                          if (result.isConfirmed) {
                            setFormData(prev => ({ ...prev, traits: [] }));
                            Swal.fire({
                              title: 'Cleared!',
                              text: 'All traits have been cleared.',
                              icon: 'success',
                              confirmButtonColor: '#f97316',
                              background: '#1e293b',
                              color: '#f1f5f9',
                              timer: 1500,
                              showConfirmButton: false
                            });
                          }
                        }}
                        className="px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all font-medium transform hover:scale-105 shadow-lg"
                        title="Clear all traits"
                      >
                        🗑️ Clear All
                      </button>
                    )}
                  </div>

                  {/* Traits Dropdown/Modal */}
                  {showTraitSelector && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-md rounded-xl p-4 z-[99999] border border-slate-600/50 shadow-2xl max-h-80">
                      <div className="space-y-4 overflow-y-auto scrollbar-hide" style={{ maxHeight: '280px' }}>
                        {Object.entries(
                          traits.reduce((acc, trait) => {
                            if (!acc[trait.category]) acc[trait.category] = [];
                            acc[trait.category].push(trait);
                            return acc;
                          }, {})
                        ).map(([category, categoryTraits]) => (
                          <div key={category} className="mb-4">
                            <h5 className="text-lg font-bold text-orange-400 border-b border-orange-500/30 pb-2 mb-3">
                              {category}
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {categoryTraits.map(trait => {
                                const isSelected = formData.traits.includes(trait._id);
                                return (
                                  <button
                                    key={trait._id}
                                    type="button"
                                    onClick={() => {
                                      setFormData(prev => ({
                                        ...prev,
                                        traits: isSelected
                                          ? prev.traits.filter(id => id !== trait._id)
                                          : [...prev.traits, trait._id]
                                      }));
                                    }}
                                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                                      isSelected
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                                    }`}
                                  >
                                    {isSelected && '✓ '}{trait.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-end mt-4 pt-2 border-t border-slate-600/50">
                        <button
                          type="button"
                          onClick={() => setShowTraitSelector(false)}
                          className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg"
                        >
                          ✅ Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected traits preview */}
              {formData.traits.length > 0 && (
                <div className="lg:col-span-2 p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
                  <p className="text-slate-300 text-sm font-medium mb-2 flex items-center gap-2">
                    <span className="text-orange-500">🎯</span>
                    Selected Traits ({formData.traits.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.traits.map(traitId => {
                      const trait = traits.find(t => t._id === traitId);
                      return trait ? (
                        <span key={traitId} className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          {trait.name}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                traits: prev.traits.filter(id => id !== traitId)
                              }));
                            }}
                            className="text-white hover:text-red-200 ml-1 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Form Buttons */}
              <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  {editingPerson ? '💾 Update Person' : '➕ Add Person'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 sm:flex-none bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          )}

          {/* People List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-orange-400 flex items-center gap-2">
              <span className="text-orange-500">👥</span>
              Your People ({persons.length})
            </h3>
            {persons.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-slate-400 text-4xl mb-4">😊</div>
                <p className="text-slate-400 text-lg">No people added yet.</p>
                <p className="text-slate-500 text-sm">Add someone to get started with personalized roasts!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-[100]">
                {persons.map((p) => (
                  <div 
                    key={p._id} 
                    className="bg-slate-800/50 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-slate-600/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg sm:text-xl font-bold text-orange-400 flex items-center gap-2">
                        <span className="text-orange-500">👤</span>
                        {p.name}
                      </h4>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(p)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all transform hover:scale-105 shadow-md"
                          title="Edit person"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(p._id, p.name)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all transform hover:scale-105 shadow-md"
                          title="Delete person"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {p.skinColor && (
                        <div className="flex items-center space-x-2">
                          <span className="text-orange-400 font-medium">🎨 Skin:</span>
                          <span className="text-slate-300">{p.skinColor}</span>
                        </div>
                      )}
                      
                      {p.animalType && (
                        <div className="flex items-center space-x-2">
                          <span className="text-orange-400 font-medium">🐾 Animal:</span>
                          <span className="text-slate-300">{p.animalType}</span>
                        </div>
                      )}
                      
                      {p.traits && p.traits.length > 0 && (
                        <div>
                          <span className="text-orange-400 font-medium block mb-2">
                            🏷️ Traits ({p.traits.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {p.traits.map(trait => (
                              <span 
                                key={trait._id} 
                                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium"
                              >
                                {trait.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        mode="login"
      />
    </div>
  );
}
