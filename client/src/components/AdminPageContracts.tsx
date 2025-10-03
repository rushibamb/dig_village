// This file contains the contracts management states and component that will be integrated into AdminPage.tsx

  // Contracts management states
  const [openTenders, setOpenTenders] = useState([
    {
      id: 1,
      title: { 
        en: 'Village Water Supply Pipeline Extension Project', 
        mr: 'गाव पाणी पुरवठा पाइपलाइन विस्तार प्रकल्प' 
      },
      department: { en: 'Water Department', mr: 'पाणी विभाग' },
      estimatedBudget: 2500000,
      issueDate: '2024-01-15',
      lastDate: '2024-02-15',
      contact: {
        name: { en: 'Mr. Rajesh Patil', mr: 'श्री. राजेश पाटील' },
        phone: '+91 9876543210'
      },
      description: {
        en: 'Extension of water supply pipeline to cover 150 additional households in Ward 4 and Ward 5',
        mr: 'वार्ड ४ आणि वार्ड ५ मधील अतिरिक्त १५० कुटुंबांना पाणी पुरवठा पाइपलाइन विस्तार'
      },
      requirements: {
        en: 'Minimum 5 years experience in pipeline projects, ISO certification required',
        mr: 'पाइपलाइन प्रकल्पांमध्ये किमान ५ वर्षांचा अनुभव, ISO प्रमाणपत्र आवश्यक'
      },
      documents: ['tender_notice.pdf', 'technical_specs.pdf', 'terms_conditions.pdf'],
      isActive: true
    },
    {
      id: 2,
      title: { 
        en: 'Village Road Construction and Repair Work', 
        mr: 'गाव रस्ता बांधकाम आणि दुरुस्ती कार्य' 
      },
      department: { en: 'Public Works Department', mr: 'सार्वजनिक बांधकाम विभाग' },
      estimatedBudget: 1800000,
      issueDate: '2024-01-20',
      lastDate: '2024-02-20',
      contact: {
        name: { en: 'Mrs. Sunita Sharma', mr: 'श्रीमती. सुनिता शर्मा' },
        phone: '+91 9876543211'
      },
      description: {
        en: 'Construction of 2.5 km concrete road from village center to school with proper drainage',
        mr: 'गाव केंद्रापासून शाळेपर्यंत २.५ किमी काँक्रीट रस्ता बांधकाम योग्य निचरा व्यवस्थेसह'
      },
      requirements: {
        en: 'Experience in road construction, Grade A contractor license required',
        mr: 'रस्ता बांधकामाचा अनुभव, ग्रेड ए कंत्राटदार परवाना आवश्यक'
      },
      documents: ['tender_notice.pdf', 'site_survey.pdf', 'material_specs.pdf'],
      isActive: true
    }
  ]);

  const [ongoingContracts, setOngoingContracts] = useState([
    {
      id: 1,
      title: { 
        en: 'Community Center Construction', 
        mr: 'सामुदायिक केंद्र बांधकाम' 
      },
      contractor: { en: 'ABC Construction Ltd.', mr: 'एबीसी कन्स्ट्रक्शन लिमिटेड' },
      allocatedBudget: 3500000,
      startDate: '2023-11-01',
      expectedCompletion: '2024-05-01',
      progress: 75,
      sitePhoto: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd',
      status: 'ongoing',
      currentPhase: {
        en: 'Interior finishing work in progress',
        mr: 'आंतरिक फिनिशिंग कार्य सुरू आहे'
      },
      timeline: [
        { phase: { en: 'Foundation', mr: 'पाया' }, completed: true, date: '2023-12-15' },
        { phase: { en: 'Structure', mr: 'संरचना' }, completed: true, date: '2024-01-30' },
        { phase: { en: 'Roofing', mr: 'छत' }, completed: true, date: '2024-02-28' },
        { phase: { en: 'Interior', mr: 'आंतरिक' }, completed: false, date: '2024-04-15' },
        { phase: { en: 'Finishing', mr: 'फिनिशिंग' }, completed: false, date: '2024-05-01' }
      ],
      isActive: true
    },
    {
      id: 2,
      title: { 
        en: 'Drainage System Development', 
        mr: 'पाणी निचरा प्रणाली विकास' 
      },
      contractor: { en: 'XYZ Infrastructure Pvt.', mr: 'एक्सवायझेड इन्फ्रास्ट्रक्चर प्रायव्हेट' },
      allocatedBudget: 2200000,
      startDate: '2024-01-15',
      expectedCompletion: '2024-06-15',
      progress: 45,
      sitePhoto: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12',
      status: 'ongoing',
      currentPhase: {
        en: 'Pipeline laying in Ward 2',
        mr: 'वार्ड २ मध्ये पाइपलाइन टाकणे'
      },
      timeline: [
        { phase: { en: 'Survey & Planning', mr: 'सर्वेक्षण आणि नियोजन' }, completed: true, date: '2024-02-01' },
        { phase: { en: 'Excavation', mr: 'खोदकाम' }, completed: true, date: '2024-03-01' },
        { phase: { en: 'Pipeline Installation', mr: 'पाइपलाइन स्थापना' }, completed: false, date: '2024-05-01' },
        { phase: { en: 'Testing & Commissioning', mr: 'चाचणी आणि सुरुवात' }, completed: false, date: '2024-06-15' }
      ],
      isActive: true
    }
  ]);

  const [completedContracts, setCompletedContracts] = useState([
    {
      id: 1,
      title: { 
        en: 'Village Main Road Concretization', 
        mr: 'गाव मुख्य रस्ता काँक्रीटीकरण' 
      },
      contractor: { en: 'Perfect Roads Ltd.', mr: 'परफेक्ट रोड्स लिमिटेड' },
      totalCost: 4200000,
      completionDate: '2023-10-15',
      finalPhoto: 'https://images.unsplash.com/photo-1548618447-14dc67c0d8f7',
      rating: 4.8,
      summary: {
        en: '3.2 km main road successfully completed with high-quality concrete and proper drainage',
        mr: '३.२ किमी मुख्य रस्ता उच्च दर्जाच्या काँक्रीट आणि योग्य निचरा व्यवस्थेसह यशस्वीपणे पूर्ण'
      },
      deliverables: [
        { item: { en: 'Road Length', mr: 'रस्त्याची लांबी' }, value: '3.2 km' },
        { item: { en: 'Drainage Lines', mr: 'निचरा रेषा' }, value: '2.8 km' },
        { item: { en: 'Street Lights', mr: 'रस्ते दिवे' }, value: '32 units' }
      ],
      isActive: true
    },
    {
      id: 2,
      title: { 
        en: 'Primary Health Center Building', 
        mr: 'प्राथमिक आरोग्य केंद्र इमारत' 
      },
      contractor: { en: 'HealthCare Construction', mr: 'हेल्थकेयर कन्स्ट्रक्शन' },
      totalCost: 5800000,
      completionDate: '2023-09-30',
      finalPhoto: 'https://images.unsplash.com/photo-1551076805-e1869033e561',
      rating: 4.9,
      summary: {
        en: 'Modern primary health center with 15 beds, emergency room, and medical equipment',
        mr: 'आधुनिक प्राथमिक आरोग्य केंद्र १५ बेड, आपत्कालीन कक्ष आणि वैद्यकीय उपकरणांसह'
      },
      deliverables: [
        { item: { en: 'Total Area', mr: 'एकूण क्षेत्रफळ' }, value: '2,500 sq ft' },
        { item: { en: 'Patient Beds', mr: 'रुग्ण बेड' }, value: '15 units' },
        { item: { en: 'Medical Equipment', mr: 'वैद्यकीय उपकरणे' }, value: 'Complete Set' }
      ],
      isActive: true
    }
  ]);

  const [contractDepartments, setContractDepartments] = useState([
    {
      id: 1,
      name: { en: 'Water Department', mr: 'पाणी विभाग' },
      head: { en: 'Mr. Rajesh Patil', mr: 'श्री. राजेश पाटील' },
      phone: '+91 9876543210',
      email: 'water.dept@rampur.gov.in',
      specialization: { en: 'Water Supply & Management', mr: 'पाणीपुरवठा आणि व्यवस्थापन' },
      isActive: true
    },
    {
      id: 2,
      name: { en: 'Public Works Department', mr: 'सार्वजनिक बांधकाम विभाग' },
      head: { en: 'Mrs. Sunita Sharma', mr: 'श्रीमती. सुनिता शर्मा' },
      phone: '+91 9876543211',
      email: 'pwd@rampur.gov.in',
      specialization: { en: 'Road Construction & Infrastructure', mr: 'रस्ता बांधकाम आणि पायाभूत सुविधा' },
      isActive: true
    },
    {
      id: 3,
      name: { en: 'Development Department', mr: 'विकास विभाग' },
      head: { en: 'Mr. Anil Kumar', mr: 'श्री. अनिल कुमार' },
      phone: '+91 9876543212',
      email: 'development@rampur.gov.in',
      specialization: { en: 'Community Development & Projects', mr: 'सामुदायिक विकास आणि प्रकल्प' },
      isActive: true
    }
  ]);

  const [contractors, setContractors] = useState([
    {
      id: 1,
      name: { en: 'ABC Construction Ltd.', mr: 'एबीसी कन्स्ट्रक्शन लिमिटेड' },
      contactPerson: { en: 'Mr. Suresh Joshi', mr: 'श्री. सुरेश जोशी' },
      phone: '+91 9876501234',
      email: 'contact@abcconstruction.com',
      address: { en: 'Plot 15, Industrial Area, Pune', mr: 'प्लॉट १५, औद्योगिक क्षेत्र, पुणे' },
      experience: { en: '15 years in construction', mr: '१५ वर्षांचा बांधकाम अनुभव' },
      specialization: { en: 'Building Construction', mr: 'इमारत बांधकाम' },
      rating: 4.5,
      isActive: true,
      completedProjects: 12
    },
    {
      id: 2,
      name: { en: 'XYZ Infrastructure Pvt.', mr: 'एक्सवायझेड इन्फ्रास्ट्रक्चर प्रायव्हेट' },
      contactPerson: { en: 'Mrs. Priya Singh', mr: 'श्रीमती. प्रिया सिंग' },
      phone: '+91 9876501235',
      email: 'info@xyzinfra.com',
      address: { en: 'Sector 23, IT Park, Mumbai', mr: 'सेक्टर २३, आयटी पार्क, मुंबई' },
      experience: { en: '20 years in infrastructure', mr: '२० वर्षांचा पायाभूत सुविधा अनुभव' },
      specialization: { en: 'Water & Drainage Systems', mr: 'पाणी आणि निचरा प्रणाली' },
      rating: 4.7,
      isActive: true,
      completedProjects: 18
    },
    {
      id: 3,
      name: { en: 'Perfect Roads Ltd.', mr: 'परफेक्ट रोड्स लिमिटेड' },
      contactPerson: { en: 'Mr. Vikram Patel', mr: 'श्री. विक्रम पटेल' },
      phone: '+91 9876501236',
      email: 'roads@perfectroads.in',
      address: { en: 'Highway Road, Nashik', mr: 'हायवे रोड, नाशिक' },
      experience: { en: '12 years in road construction', mr: '१२ वर्षांचा रस्ता बांधकाम अनुभव' },
      specialization: { en: 'Road Construction & Maintenance', mr: 'रस्ता बांधकाम आणि देखभाल' },
      rating: 4.8,
      isActive: true,
      completedProjects: 25
    }
  ]);

  // Contract management UI states
  const [contractsSearchTerm, setContractsSearchTerm] = useState('');
  const [contractsStatusFilter, setContractsStatusFilter] = useState('All');
  const [contractsTypeFilter, setContractsTypeFilter] = useState('All');
  const [contractsCurrentPage, setContractsCurrentPage] = useState(1);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isContractDetailOpen, setIsContractDetailOpen] = useState(false);
  const [isAddTenderOpen, setIsAddTenderOpen] = useState(false);
  const [isEditContractOpen, setIsEditContractOpen] = useState(false);
  const [isContractorManagementOpen, setIsContractorManagementOpen] = useState(false);
  const [isAddContractorOpen, setIsAddContractorOpen] = useState(false);
  const [isDepartmentContractManagementOpen, setIsDepartmentContractManagementOpen] = useState(false);
  const [isAddContractDepartmentOpen, setIsAddContractDepartmentOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [selectedContractDepartment, setSelectedContractDepartment] = useState(null);
  const [contractsViewMode, setContractsViewMode] = useState('grid');
  const [contractActiveSection, setContractActiveSection] = useState('tenders');

  const [newTender, setNewTender] = useState({
    title: { en: '', mr: '' },
    department: '',
    estimatedBudget: '',
    issueDate: '',
    lastDate: '',
    contact: { name: { en: '', mr: '' }, phone: '' },
    description: { en: '', mr: '' },
    requirements: { en: '', mr: '' },
    documents: []
  });

  const [newOngoingContract, setNewOngoingContract] = useState({
    title: { en: '', mr: '' },
    contractor: '',
    allocatedBudget: '',
    startDate: '',
    expectedCompletion: '',
    progress: 0,
    currentPhase: { en: '', mr: '' },
    sitePhoto: null
  });

  const [newCompletedContract, setNewCompletedContract] = useState({
    title: { en: '', mr: '' },
    contractor: '',
    totalCost: '',
    completionDate: '',
    rating: 5,
    summary: { en: '', mr: '' },
    finalPhoto: null,
    deliverables: []
  });

  const [newContractor, setNewContractor] = useState({
    name: { en: '', mr: '' },
    contactPerson: { en: '', mr: '' },
    phone: '',
    email: '',
    address: { en: '', mr: '' },
    experience: { en: '', mr: '' },
    specialization: { en: '', mr: '' }
  });

  const [newContractDepartment, setNewContractDepartment] = useState({
    name: { en: '', mr: '' },
    head: { en: '', mr: '' },
    phone: '',
    email: '',
    specialization: { en: '', mr: '' }
  });