import React, { useState, useMemo } from 'react';

// Composant principal de gestion des élèves
function GestionEleves() {
  // État initial avec quelques élèves
  const [students, setStudents] = useState([
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      classe: '6ème A',
      notes: {
        'Mathématiques': 16,
        'Français': 15,
        'Histoire-Géo': 14,
        'Anglais': 17
      }
    },s
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Marie',
      classe: '6ème A',
      notes: {
        'Mathématiques': 18,
        'Français': 16,
        'Histoire-Géo': 15,
        'Anglais': 19
      }
    },
    {
      id: 3,
      nom: 'Leroy',
      prenom: 'Pierre',
      classe: '6ème B',
      notes: {
        'Mathématiques': 12,
        'Français': 13,
        'Histoire-Géo': 11,
        'Anglais': 14
      }
    },
    {
      id: 4,
      nom: 'Petit',
      prenom: 'Sophie',
      classe: '6ème B',
      notes: {
        'Mathématiques': 19,
        'Français': 17,
        'Histoire-Géo': 16,
        'Anglais': 18
      }
    }
  ]);

  // État pour le formulaire d'ajout/édition
  const [currentStudent, setCurrentStudent] = useState({
    notes: {}
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Nouvel état pour la confirmation de suppression
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Calculer la moyenne générale d'un élève
  const calculateMoyenne = (student) => {
    const matieres = Object.keys(student.notes);
    const moyenne = matieres.reduce((sum, matiere) => sum + student.notes[matiere], 0) / matieres.length;
    return Number(moyenne.toFixed(2));
  };

  // Classement des élèves par moyenne
  const classementEleves = useMemo(() => {
    return [...students].sort((a, b) => calculateMoyenne(b) - calculateMoyenne(a));
  }, [students]);

  // Fonction pour ajouter/mettre à jour un élève
  const handleSaveStudent = () => {
    if (isEditing) {
      // Mise à jour
      setStudents(students.map(student => 
        student.id === currentStudent.id ? currentStudent : student
      ));
    } else {
      // Ajout
      const newStudent = {
        ...currentStudent,
        id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1
      };
      setStudents([...students, newStudent]);
    }
    
    // Réinitialisation du formulaire
    setCurrentStudent({ notes: {} });
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  // Nouvelle fonction pour supprimer un élève
  const handleDeleteStudent = () => {
    if (studentToDelete) {
      setStudents(students.filter(student => student.id !== studentToDelete.id));
      setStudentToDelete(null);
    }
  };

  // Fonction pour obtenir un style de classement
  const getClassementStyle = (index) => {
    switch(index) {
      case 0:
        return 'bg-yellow-100 border-4 border-yellow-500';
      case 1:
        return 'bg-gray-100 border-2 border-gray-400';
      case 2:
        return 'bg-orange-100 border-2 border-orange-400';
      default:
        return '';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Gestion des Élèves et Notes
      </h1>

      {/* Classement des meilleurs élèves */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-6 w-6 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          Top Élèves
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {classementEleves.slice(0, 3).map((student, index) => (
            <div 
              key={student.id} 
              className={`p-4 rounded-lg ${getClassementStyle(index)} flex items-center justify-between`}
            >
              <div>
                <div className="font-bold text-lg">
                  {index === 0 && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline mr-2 h-5 w-5 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  )}
                  {student.nom} {student.prenom}
                </div>
                <div className="text-sm text-gray-600">{student.classe}</div>
              </div>
              <div className="font-bold text-xl">
                {calculateMoyenne(student)}/20
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton Ajouter */}
      <div className="mb-4 flex justify-end">
        <button 
          onClick={() => {
            setCurrentStudent({ notes: {} });
            setIsEditing(false);
            setIsDialogOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Ajouter un élève
        </button>
      </div>

      {/* Modale de confirmation de suppression */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">Confirmer la suppression</h2>
            <p className="mb-4">
              Voulez-vous vraiment supprimer {studentToDelete.prenom} {studentToDelete.nom} ?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteStudent}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale d'ajout/édition */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Éditer un élève' : 'Ajouter un élève'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="nom" className="block mb-2">Nom</label>
                <input
                  id="nom"
                  type="text"
                  value={currentStudent.nom || ''}
                  onChange={(e) => setCurrentStudent({
                    ...currentStudent,
                    nom: e.target.value
                  })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              
              <div>
                <label htmlFor="prenom" className="block mb-2">Prénom</label>
                <input
                  id="prenom"
                  type="text"
                  value={currentStudent.prenom || ''}
                  onChange={(e) => setCurrentStudent({
                    ...currentStudent,
                    prenom: e.target.value
                  })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              
              <div>
                <label htmlFor="classe" className="block mb-2">Classe</label>
                <input
                  id="classe"
                  type="text"
                  value={currentStudent.classe || ''}
                  onChange={(e) => setCurrentStudent({
                    ...currentStudent,
                    classe: e.target.value
                  })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block mb-2">Notes</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Mathématiques', 'Français', 'Histoire-Géo', 'Anglais'].map(matiere => (
                    <div key={matiere} className="flex flex-col">
                      <label className="text-sm mb-1">{matiere}</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={currentStudent.notes?.[matiere] || ''}
                        onChange={(e) => setCurrentStudent({
                          ...currentStudent,
                          notes: {
                            ...currentStudent.notes,
                            [matiere]: Number(e.target.value)
                          }
                        })}
                        className="w-full px-2 py-1 border rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveStudent}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isEditing ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des élèves */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Nom</th>
              <th className="border p-2 text-left">Prénom</th>
              <th className="border p-2 text-left">Classe</th>
              <th className="border p-2 text-right">Moyenne</th>
              <th className="border p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="border p-2">{student.nom}</td>
                <td className="border p-2">{student.prenom}</td>
                <td className="border p-2">{student.classe}</td>
                <td className="border p-2 text-right font-medium">
                  {calculateMoyenne(student)}
                </td>
                <td className="border p-2 text-right flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setCurrentStudent(student);
                      setIsEditing(true);
                      setIsDialogOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Éditer
                  </button>
                  <button
                    onClick={() => setStudentToDelete(student)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='p-6 text-center'>Create by Anjara | Shanone | Cathy</div>
    </div>
  );
};

export default GestionEleves;