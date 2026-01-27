import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/Lesson.css";
import { markVideoWatched as saveVideoToStorage, getWatchedVideos, markIntroVideoCompleted, addXP, addCoins, markLessonCompleted, bookTutoringSession, logActivity, setUserData, checkAndUnlockAchievements } from "../utils/storageManager";

// Helper function to format dates
function formatDate(date) {
  if (!date) return "just now";
  try {
    let d;
    // Handle string, Date object, or plain object with date properties
    if (typeof date === "string") {
      d = new Date(date);
    } else if (date instanceof Date) {
      d = date;
    } else if (typeof date === "object" && date.toString) {
      // Plain object - try to convert
      d = new Date(date.toString());
    } else {
      return "just now";
    }
    
    // Validate the date
    if (!(d instanceof Date) || isNaN(d)) {
      return "just now";
    }
    
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  } catch (error) {
    console.error("formatDate error:", error, date);
    return "just now";
  }
}

export default function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log("🔍 lessonId from URL params:", lessonId);

  // Helper function to get the appropriate back navigation path based on lesson category
  const getBackNavigationPath = () => {
    // All lessons data (synced with Lessons.js)
    const allLessons = [
      { id: 1, title: "Cell Structure & Function", category: "biology", description: "Learn about cell components and their functions", lesson_number: 1, videos: [
        { id: 1, title: "Introduction to Biology", url: "https://www.youtube.com/watch?v=tZE_fQFK8EY" },
        { id: 2, title: "Scientific Method", url: "https://www.youtube.com/watch?v=xOLcZMw0hd4" },
        { id: 3, title: "What do Biologists Do?", url: "https://www.youtube.com/watch?v=rgZhDoPgzK8" },
        { id: 4, title: "Organized Life", url: "https://www.youtube.com/watch?v=cjR5zPrVjTc" },
        { id: 5, title: "Introduction to Ecology", url: "https://www.youtube.com/watch?v=aO3Yp45zmw8" },
      ] },
      { id: 2, title: "Photosynthesis", category: "biology", description: "Understand how plants convert sunlight into energy", lesson_number: 2, videos: [
        { id: 1, title: "Light Reactions", url: "https://www.youtube.com/watch?v=dQCAPalUOL0" },
        { id: 2, title: "Dark Reactions", url: "https://www.youtube.com/watch?v=h4T8T-p-SdY" },
      ] },
      { id: 3, title: "Evolution & Natural Selection", category: "biology", description: "Explore the mechanisms of evolution", lesson_number: 3, videos: [] },
      { id: 4, title: "Atomic Structure", category: "chemistry", description: "Master the basics of atoms and electrons", lesson_number: 4, videos: [] },
      { id: 5, title: "Chemical Bonding", category: "chemistry", description: "Learn about different types of chemical bonds", lesson_number: 5, videos: [] },
      { id: 6, title: "Reactions & Equations", category: "chemistry", description: "Understanding chemical reactions and balancing equations", lesson_number: 6, videos: [] },
      { id: 7, title: "Force & Motion", category: "physics", description: "Newton's laws and motion fundamentals", lesson_number: 7, videos: [] },
      { id: 8, title: "Energy & Work", category: "physics", description: "Learn about kinetic and potential energy", lesson_number: 8, videos: [] },
      { id: 9, title: "Waves & Sound", category: "physics", description: "Understanding waves, frequency, and sound", lesson_number: 9, videos: [] },
      { id: 10, title: "Climate Change", category: "environmental", description: "Causes and effects of global climate change", lesson_number: 10, videos: [] },
      { id: 11, title: "Ecosystems & Biodiversity", category: "environmental", description: "Explore biodiversity and ecosystem interactions", lesson_number: 11, videos: [] },
      { id: 12, title: "World History Overview", category: "history", description: "Major events that shaped world history", lesson_number: 12, videos: [] },
      { id: 13, title: "Economics Fundamentals", category: "economics", description: "Supply, demand, and market economics", lesson_number: 13, videos: [] },
    ];

    const categoryMap = {
      biology: "/biology",
      chemistry: "/chemistry",
      physics: "/physics",
      environmental: "/environmental-science",
      history: "/history",
      economics: "/economics",
      geography: "/human-geography",
      psychology: "/psychology",
    };
    
    // First try to get category from lesson object
    let category = currentLesson?.category;
    console.log("🔙 Back button - lesson.category:", category);
    
    // If not found, look it up from allLessons using lesson ID
    if (!category) {
      const lessonId = parseInt(currentLesson?.id || currentLesson?.lesson_number);
      const foundLesson = allLessons.find(l => l.id === lessonId);
      category = foundLesson?.category || "biology";
      console.log("🔙 Back button - looked up from allLessons, found category:", category);
    }
    
    const path = categoryMap[category] || "/biology";
    console.log("🔙 Back button - navigating to:", path);
    return path;
  };

  // Helper function to find and navigate to next lesson
  // Commented out - no longer needed, using direct navigation instead
  /*
  const navigateToNextLesson = () => {
    // All lessons data (synced with Lessons.js)
    const allLessons = [
      { id: 1, title: "Cell Structure & Function", category: "biology", description: "Learn about cell components and their functions", lesson_number: 1, videos: [
        { id: 1, title: "Introduction to Biology", url: "https://www.youtube.com/watch?v=tZE_fQFK8EY" },
        { id: 2, title: "Scientific Method", url: "https://www.youtube.com/watch?v=xOLcZMw0hd4" },
        { id: 3, title: "What do Biologists Do?", url: "https://www.youtube.com/watch?v=rgZhDoPgzK8" },
        { id: 4, title: "Organized Life", url: "https://www.youtube.com/watch?v=cjR5zPrVjTc" },
        { id: 5, title: "Introduction to Ecology", url: "https://www.youtube.com/watch?v=aO3Yp45zmw8" },
      ] },
      { id: 2, title: "Photosynthesis", category: "biology", description: "Understand how plants convert sunlight into energy", lesson_number: 2, videos: [
        { id: 1, title: "Light Reactions", url: "https://www.youtube.com/watch?v=dQCAPalUOL0" },
        { id: 2, title: "Dark Reactions", url: "https://www.youtube.com/watch?v=h4T8T-p-SdY" },
      ] },
      { id: 3, title: "Evolution & Natural Selection", category: "biology", description: "Explore the mechanisms of evolution", lesson_number: 3, videos: [] },
      { id: 4, title: "Atomic Structure", category: "chemistry", description: "Master the basics of atoms and electrons", lesson_number: 4, videos: [] },
      { id: 5, title: "Chemical Bonding", category: "chemistry", description: "Learn about different types of chemical bonds", lesson_number: 5, videos: [] },
      { id: 6, title: "Reactions & Equations", category: "chemistry", description: "Understanding chemical reactions and balancing equations", lesson_number: 6, videos: [] },
      { id: 7, title: "Force & Motion", category: "physics", description: "Newton's laws and motion fundamentals", lesson_number: 7, videos: [] },
      { id: 8, title: "Energy & Work", category: "physics", description: "Learn about kinetic and potential energy", lesson_number: 8, videos: [] },
      { id: 9, title: "Waves & Sound", category: "physics", description: "Understanding waves, frequency, and sound", lesson_number: 9, videos: [] },
      { id: 10, title: "Climate Change", category: "environmental", description: "Causes and effects of global climate change", lesson_number: 10, videos: [] },
      { id: 11, title: "Ecosystems & Biodiversity", category: "environmental", description: "Explore biodiversity and ecosystem interactions", lesson_number: 11, videos: [] },
      { id: 12, title: "World History Overview", category: "history", description: "Major events that shaped world history", lesson_number: 12, videos: [] },
      { id: 13, title: "Economics Fundamentals", category: "economics", description: "Supply, demand, and market economics", lesson_number: 13, videos: [] },
    ];
    
    const currentLessonId = parseInt(lesson?.id);
    console.log("📊 Current lesson ID:", currentLessonId);
    const nextLesson = allLessons.find(l => l.id === currentLessonId + 1);
    
    if (nextLesson) {
      console.log("🎯 Navigating to next lesson:", nextLesson.id, nextLesson.title);
      navigate(`/lesson/${nextLesson.id}`, { state: { lesson: nextLesson } });
    } else {
      console.log("✅ All lessons completed!");
      navigate("/lessons", { replace: true });
    }
  };
  */

  const [tutors, setTutors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [signupProcessing, setSignupProcessing] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [bookedSession, setBookedSession] = useState(null);
  const [watchedVideos, setWatchedVideos] = useState({});
  const [currentVideoPlayer, setCurrentVideoPlayer] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [worksheet1Answers, setWorksheet1Answers] = useState({});
  const [worksheet2Answers, setWorksheet2Answers] = useState({});
  const [worksheet1Submitted, setWorksheet1Submitted] = useState(false);
  const [worksheet2Submitted, setWorksheet2Submitted] = useState(false);
  const [step3Completed, setStep3Completed] = useState(false);
  const [step4Completed, setStep4Completed] = useState(false);
  const [step5Completed, setStep5Completed] = useState(false);
  const [step6Completed, setStep6Completed] = useState(false);
  const [lessonXPAwarded, setLessonXPAwarded] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stepTransitionAnimating, setStepTransitionAnimating] = useState(false);
  
  // Load Q&A questions from localStorage (shared with QnA.js page)
  const QNA_STORAGE_KEY = "scihub_qna_questions";
  const [communityPosts, setCommunityPosts] = useState([]);

  // Define all lessons data
  const allLessonsData = [
    { id: 1, title: "Cell Structure & Function", category: "biology", description: "Learn about cell components and their functions", lesson_number: 1, videos: [
      { id: 1, title: "Introduction to Biology", url: "https://www.youtube.com/watch?v=tZE_fQFK8EY" },
      { id: 2, title: "Scientific Method", url: "https://www.youtube.com/watch?v=xOLcZMw0hd4" },
      { id: 3, title: "What do Biologists Do?", url: "https://www.youtube.com/watch?v=rgZhDoPgzK8" },
      { id: 4, title: "Organized Life", url: "https://www.youtube.com/watch?v=cjR5zPrVjTc" },
      { id: 5, title: "Introduction to Ecology", url: "https://www.youtube.com/watch?v=aO3Yp45zmw8" },
    ] },
    { id: 2, title: "Photosynthesis", category: "biology", description: "Understand how plants convert sunlight into energy", lesson_number: 2, videos: [
      { id: 1, title: "Light Reactions", url: "https://www.youtube.com/watch?v=dQCAPalUOL0" },
      { id: 2, title: "Dark Reactions", url: "https://www.youtube.com/watch?v=h4T8T-p-SdY" },
    ] },
    { id: 3, title: "Genetics & Evolution", category: "biology", description: "Explore inheritance and natural selection", lesson_number: 3, videos: [] },
    { id: 4, title: "Atomic Structure", category: "chemistry", description: "Master the basics of atoms and electrons", lesson_number: 4, videos: [] },
    { id: 5, title: "Chemical Bonding", category: "chemistry", description: "Learn about different types of chemical bonds", lesson_number: 5, videos: [] },
    { id: 6, title: "Reactions & Equations", category: "chemistry", description: "Understanding chemical reactions and balancing equations", lesson_number: 6, videos: [] },
    { id: 7, title: "Force & Motion", category: "physics", description: "Newton's laws and motion fundamentals", lesson_number: 7, videos: [] },
    { id: 8, title: "Energy & Work", category: "physics", description: "Learn about kinetic and potential energy", lesson_number: 8, videos: [] },
    { id: 9, title: "Waves & Sound", category: "physics", description: "Understanding waves, frequency, and sound", lesson_number: 9, videos: [] },
    { id: 10, title: "Climate Change", category: "environmental", description: "Causes and effects of global climate change", lesson_number: 10, videos: [] },
    { id: 11, title: "Ecosystems & Biodiversity", category: "environmental", description: "Explore biodiversity and ecosystem interactions", lesson_number: 11, videos: [] },
    { id: 12, title: "World History Overview", category: "history", description: "Major events that shaped world history", lesson_number: 12, videos: [] },
    { id: 13, title: "Economics Fundamentals", category: "economics", description: "Supply, demand, and market economics", lesson_number: 13, videos: [] },
  ];

  // Synchronously load initial lesson data to avoid null on first render
  let initialLesson = location.state?.lesson;
  if (!initialLesson) {
    initialLesson = allLessonsData.find(l => String(l.id) === String(lessonId));
    if (!initialLesson) {
      initialLesson = {
        id: lessonId,
        lesson_number: 1,
        title: "Introduction to Biology",
        category: "biology",
        description: "Master the concepts and skills in this lesson with guided lessons and tutor support.",
        videos: [
          { id: 1, title: "Introduction to Biology", url: "https://www.youtube.com/watch?v=tZE_fQFK8EY&list=PL8dPuuaLjXtPW_ofbxdHNciuLoTRLPMgB&index=2" },
          { id: 2, title: "Scientific Method", url: "https://www.youtube.com/watch?v=xOLcZMw0hd4&list=PL8dPuuaLjXtPW_ofbxdHNciuLoTRLPMgB&index=3" },
          { id: 3, title: "What do Biologists Do?", url: "https://www.youtube.com/watch?v=rgZhDoPgzK8&list=PL8dPuuaLjXtPW_ofbxdHNciuLoTRLPMgB&index=4" },
          { id: 4, title: "Organized Life", url: "https://www.youtube.com/watch?v=cjR5zPrVjTc&list=PL8dPuuaLjXtPW_ofbxdHNciuLoTRLPMgB&index=5" },
          { id: 5, title: "Introduction to Ecology", url: "https://www.youtube.com/watch?v=aO3Yp45zmw8&list=PL8dPuuaLjXtPW_ofbxdHNciuLoTRLPMgB&index=6" },
        ]
      };
    }
  }

  // Use as state for reactivity when lessonId changes
  const [currentLesson, setCurrentLesson] = useState(initialLesson);
  const lesson = currentLesson;

  // Load lesson from state or fetch by ID when lessonId changes
  useEffect(() => {
    console.log("🔄 Loading lesson for lessonId:", lessonId);
    
    let lesson = location.state?.lesson;
    
    if (!lesson) {
      // Try to find lesson from allLessonsData
      lesson = allLessonsData.find(l => String(l.id) === String(lessonId));
      if (!lesson) {
        // Last resort fallback
        lesson = {
          id: lessonId,
          lesson_number: 1,
          title: "Introduction to Biology",
          category: "biology",
          description: "Master the concepts and skills in this lesson with guided lessons and tutor support.",
          videos: [
            { id: 1, title: "Introduction to Biology", url: "https://www.youtube.com/watch?v=tZE_fQFK8EY&list=PL8dPuuaLjXtPW_ofbxdHNciuLoTRLPMgB&index=2" },
            { id: 2, title: "Scientific Method", url: "https://www.youtube.com/watch?v=xOLcZMw0hd4&list=PL8dPuuaLjXtPW_ofbxdHNciuLoTRLPMgB&index=3" },
            { id: 3, title: "What do Biologists Do?", url: "https://www.youtube.com/watch?v=rgZhDoPgzK8&list=PL8dPuuaLjXtPW_ofbxdHNciuLoTRLPMgB&index=4" },
            { id: 4, title: "Organized Life", url: "https://www.youtube.com/watch?v=cjR5zPrVjTc&list=PL8dPuuaLjXtPW_ofbxdHNciuLoTRLPMgB&index=5" },
            { id: 5, title: "Introduction to Ecology", url: "https://www.youtube.com/watch?v=aO3Yp45zmw8&list=PL8dPuuaLjXtPW_ofbxdHNciuLoTRLPMgB&index=6" },
          ]
        };
      }
    }
    
    console.log("✅ Lesson loaded:", lesson);
    setCurrentLesson(lesson);
    
    // Reset step to 1 when lesson changes
    setActiveStep(1);
    // Clear video watched tracking for new lesson
    setWatchedVideos({});
    // Reset all step completion states
    setStep3Completed(false);
    setStep4Completed(false);
    setStep5Completed(false);
    setStep6Completed(false);
    setLessonXPAwarded(false);
    // Reset worksheet answers
    setWorksheet1Answers({});
    setWorksheet2Answers({});
    setWorksheet1Submitted(false);
    setWorksheet2Submitted(false);
    
    // Cleanup function when component unmounts
    return () => {
      console.log("🧹 Cleaning up Lesson component");
      // Close any open video modal
      setCurrentVideoPlayer(null);
    };
  }, [lessonId, location.state]); // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    // Load shared questions from localStorage
    const getStoredQuestions = () => {
      try {
        const stored = localStorage.getItem(QNA_STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (error) {
        console.error("Error reading Q&A from localStorage:", error);
      }
      return [];
    };
    
    const stored = getStoredQuestions();
    // Convert to communityPosts format for display
    const posts = stored.map((q) => ({
      id: q.id,
      author: q.author,
      type: "question",
      content: q.body,
      timestamp: formatDate(q.timestamp),
      replies: q.replies?.length || 0,
      likes: q.replies?.reduce((sum, r) => sum + (r.upvotes || 0), 0) || 0,
      title: q.title,
      answers: q.replies || [],
      views: q.views || 0,
    }));
    setCommunityPosts(posts);
  }, []);

  // Trigger celebration animation when a step is completed
  // (Currently unused - celebration removed in favor of timeline progress visualization)
  // const triggerCelebration = () => {
  //   setShowCelebration(true);
  //   setTimeout(() => setShowCelebration(false), 2000);
  // };

  // Use videos from the lesson object if available, otherwise fallback to default Biology videos
  const defaultLessonVideos = [
    { id: 1, title: "Introduction to Biology", url: "https://www.youtube.com/watch?v=tZE_fQFK8EY&list=PL8dPuuaLjXtPW_ofbxdHNciuLoTRLPMgB&index=2" },
    { id: 2, title: "Scientific Method", url: "https://www.youtube.com/watch?v=xOLcZMw0hd4&list=PL8dPuuaLjXtPW_ofbxdHNciuLoTRLPMgB&index=3" },
    { id: 3, title: "What do Biologists Do?", url: "https://www.youtube.com/watch?v=rgZhDoPgzK8&list=PL8dPuuaLjXtPW_ofbxdHNciuLoTRLPMgB&index=4" },
    { id: 4, title: "Organized Life", url: "https://www.youtube.com/watch?v=cjR5zPrVjTc&list=PL8dPuuaLjXtPW_ofbxdHNciuLoTRLPMgB&index=5" },
    { id: 5, title: "Introduction to Ecology", url: "https://www.youtube.com/watch?v=aO3Yp45zmw8&list=PL8dPuuaLjXtPW_ofbxdHNciuLoTRLPMgB&index=6" },
  ];
  
  const lessonVideos = currentLesson?.videos || defaultLessonVideos;

  // Create detailed worksheets based on lesson content - 7 questions each
  const createDetailedWorksheets = (videos, lessonTitle) => {
    // Map lesson titles to 7 questions covering the lesson content
    const worksheetMap = {
      // Biology Lesson 1: Introduction to Biology
      "Introduction to Biology": [
        { id: 1, question: "What is the primary definition of biology?", options: ["The study of chemistry", "The scientific study of life and living organisms", "The study of fossils", "The study of rocks"], correct: 1 },
        { id: 2, question: "Which of the following is a characteristic of all living organisms?", options: ["They are stationary", "They are made of cells", "They never change", "They exist only on land"], correct: 1 },
        { id: 3, question: "What is the smallest unit of life?", options: ["Atom", "Molecule", "Cell", "Organism"], correct: 2 },
        { id: 4, question: "What is homeostasis?", options: ["A type of evolution", "An organism's ability to maintain stable internal conditions", "A disease", "A geographic location"], correct: 1 },
        { id: 5, question: "What is the scientific method?", options: ["Guessing randomly", "A systematic process for testing ideas through observation and experimentation", "Only for physics", "No real method"], correct: 1 },
        { id: 6, question: "What is ecology the study of?", options: ["Only rocks", "Organisms and their interactions with the environment", "Weather only", "Chemistry"], correct: 1 },
        { id: 7, question: "What do all living organisms require to survive?", options: ["Only water", "Energy, materials, and a way to reproduce", "Only sunlight", "Only oxygen"], correct: 1 }
      ],
      // Biology Lesson 2: Ecology
      "Ecology": [
        { id: 1, question: "What is community ecology?", options: ["Only studying human societies", "The study of how different species interact in a shared environment", "The study of just one species", "Urban planning"], correct: 1 },
        { id: 2, question: "What is the role of decomposers in an ecosystem?", options: ["Creating new food", "Breaking down dead matter and recycling nutrients back into the soil", "Predation and hunting", "Fixing nitrogen only"], correct: 1 },
        { id: 3, question: "What is a food chain?", options: ["Stores selling food", "A sequence showing how energy flows from organism to organism", "Just plants and herbivores", "Only predators and prey"], correct: 1 },
        { id: 4, question: "What is the carrying capacity of an environment?", options: ["What organisms can physically carry", "The maximum population size an environment can support sustainably", "Birth rate", "Immigration rate"], correct: 1 },
        { id: 5, question: "What is a limiting factor in population growth?", options: ["Factors that always increase population", "Factors like food, space, disease, or predation that restrict growth", "Only temperature", "Only available water"], correct: 1 },
        { id: 6, question: "What is climate change?", options: ["Weather variations within a single season", "Long-term shifts in global temperature and weather patterns", "Not actually happening", "Only seasonal variation"], correct: 1 },
        { id: 7, question: "What is conservation biology?", options: ["Preserving historic buildings", "The science of protecting biodiversity and ecosystems from extinction and degradation", "Only protecting animals", "Not a real scientific field"], correct: 1 }
      ],
      // Biology Lesson 3: Evolution
      "Evolution": [
        { id: 1, question: "What is evolution?", options: ["Change in fashion over time", "Change in the genetic composition of populations over time", "Individual growth and development", "Not a natural process"], correct: 1 },
        { id: 2, question: "What is natural selection?", options: ["Humans choosing which animals to breed", "Process where organisms with beneficial traits are more likely to survive and reproduce", "Random changes in organisms", "Only happens in nature reserves"], correct: 1 },
        { id: 3, question: "What is adaptation?", options: ["A disease or illness", "A trait that helps an organism survive and reproduce in its environment", "A human invention", "None of the above"], correct: 1 },
        { id: 4, question: "What evidence supports evolution?", options: ["Only fossils", "Fossil records, DNA similarities, anatomical structures, and observed changes", "Only living organisms", "Not enough evidence"], correct: 1 },
        { id: 5, question: "What is a population in evolutionary terms?", options: ["A city or town", "A group of organisms of the same species living in the same area", "All organisms on Earth", "Just humans"], correct: 1 },
        { id: 6, question: "What is speciation?", options: ["A disease in species", "The process by which new species arise from existing ones", "Species becoming extinct", "Not observable"], correct: 1 },
        { id: 7, question: "What is genetic variation?", options: ["Genetic mutations that are harmful", "The differences in traits among individuals in a population", "Only differences between species", "Not important for evolution"], correct: 1 }
      ],
      // Biology Lesson 4: Evolutionary History
      "Evolutionary History": [
        { id: 1, question: "What are fossils?", options: ["Living organisms", "Preserved remains or impressions of organisms from the past", "Only bones", "Not useful for science"], correct: 1 },
        { id: 2, question: "What is phylogeny?", options: ["A type of disease", "The evolutionary history and relationships among organisms", "Only human ancestry", "Not scientifically proven"], correct: 1 },
        { id: 3, question: "What is a biological molecule essential to all life?", options: ["Proteins only", "Carbon-based molecules like proteins, nucleic acids, lipids, and carbohydrates", "Only minerals", "Inorganic materials"], correct: 1 },
        { id: 4, question: "What does DNA stand for?", options: ["Dynamic Nucleic Arrangement", "Deoxyribonucleic Acid", "Not important to know", "Different in each organism"], correct: 1 },
        { id: 5, question: "How do we know humans evolved?", options: ["We don't have evidence", "Fossil records, DNA similarities to other primates, and anatomical structures show our evolutionary history", "Only through theories", "It's not proven"], correct: 1 },
        { id: 6, question: "What is the significance of the fossil record?", options: ["Just interesting artifacts", "Shows the progression of life forms and extinctions throughout Earth's history", "Doesn't show anything meaningful", "Only shows current species"], correct: 1 },
        { id: 7, question: "What makes organisms related evolutionarily?", options: ["Living together", "Sharing common ancestors and genetic similarities", "Same color", "Nothing makes them related"], correct: 1 }
      ],
      // Biology Lesson 5: Cell Structure
      "Cell Structure": [
        { id: 1, question: "What is the basic unit of life?", options: ["Atom", "The cell", "Molecule", "Organism"], correct: 1 },
        { id: 2, question: "What is the main difference between prokaryotic and eukaryotic cells?", options: ["Size only", "Eukaryotic cells have a nucleus and organelles, prokaryotic cells do not", "Prokaryotes are always larger", "No real difference"], correct: 1 },
        { id: 3, question: "What is the function of the nucleus?", options: ["Producing energy", "Controlling cell activities and storing genetic information", "Breaking down waste", "Providing structure only"], correct: 1 },
        { id: 4, question: "What is the cell membrane?", options: ["The outer wall of plant cells only", "A selective barrier that controls what enters and exits the cell", "Not necessary for cell function", "Only found in animals"], correct: 1 },
        { id: 5, question: "What is the function of mitochondria?", options: ["Storing genetic information", "Producing energy (ATP) for the cell", "Protein synthesis", "Waste storage"], correct: 1 },
        { id: 6, question: "What do chloroplasts do?", options: ["Store water", "Perform photosynthesis to convert light energy into chemical energy", "Break down glucose", "Only in animal cells"], correct: 1 },
        { id: 7, question: "How do cells communicate with each other?", options: ["They don't communicate", "Through chemical signals and receptors on cell surfaces", "Only through direct contact", "Only in nerve cells"], correct: 1 }
      ],
      // Biology Lesson 6: Cell Division & Energy
      "Cell Division & Energy": [
        { id: 1, question: "What is cellular respiration?", options: ["Breathing oxygen", "The process of breaking down glucose to release energy (ATP)", "Only occurs in lungs", "Not related to energy"], correct: 1 },
        { id: 2, question: "What is photosynthesis?", options: ["Using energy from food", "Converting light energy into chemical energy stored in glucose", "Only occurs in animals", "Requires no light"], correct: 1 },
        { id: 3, question: "What is mitosis?", options: ["Cell death", "The process of cell division that produces two identical daughter cells", "Sexual reproduction", "Only occurs in bacteria"], correct: 1 },
        { id: 4, question: "What is meiosis?", options: ["Regular cell division", "Cell division that produces four genetically diverse sex cells", "Only in plants", "Not related to reproduction"], correct: 1 },
        { id: 5, question: "What is the cell cycle?", options: ["How cells move", "The series of events between cell divisions including growth, DNA replication, and division", "Only in bacteria", "A myth"], correct: 1 },
        { id: 6, question: "What role does ATP play in cells?", options: ["Stores genetic information", "The primary energy currency that powers cellular functions", "Breaks down waste only", "Not important"], correct: 1 },
        { id: 7, question: "What happens during the S phase of the cell cycle?", options: ["Mitosis occurs", "DNA replication occurs, copying genetic material", "Cell division happens", "Cell death occurs"], correct: 1 }
      ],
      // Biology Lesson 7: Genetics Basics
      "Genetics Basics": [
        { id: 1, question: "What is a gene?", options: ["A disease", "A segment of DNA that codes for a specific protein or trait", "Only found in humans", "Not important"], correct: 1 },
        { id: 2, question: "What are alleles?", options: ["Different species", "Different versions of the same gene", "Genetic disorders", "Not real"], correct: 1 },
        { id: 3, question: "What is DNA replication?", options: ["Breaking down DNA", "The process of making an exact copy of DNA before cell division", "Only in bacteria", "Not necessary"], correct: 1 },
        { id: 4, question: "What is transcription?", options: ["DNA replication", "The process of copying DNA into RNA for protein production", "Only in prokaryotes", "Not important"], correct: 1 },
        { id: 5, question: "What is translation?", options: ["Converting languages", "The process of using RNA to build proteins", "Only in plant cells", "Not related to genetics"], correct: 1 },
        { id: 6, question: "What is a dominant trait?", options: ["A trait that doesn't appear", "A trait that appears in offspring when inherited from either parent", "Always harmful", "Never occurs"], correct: 1 },
        { id: 7, question: "What is a recessive trait?", options: ["A dominant trait", "A trait that only appears when inherited from both parents", "Always beneficial", "Not visible"], correct: 1 }
      ],
      // Biology Lesson 8: Gene Expression
      "Gene Expression": [
        { id: 1, question: "What is gene expression?", options: ["How genes look", "The process by which genetic information is used to produce proteins", "Only in plants", "A theory only"], correct: 1 },
        { id: 2, question: "What is a mutation?", options: ["Evolution", "A permanent change in DNA sequence", "Always harmful", "Never happens"], correct: 1 },
        { id: 3, question: "What can cause genetic mutations?", options: ["Nothing causes them", "Radiation, chemicals, copying errors, and environmental factors", "Only age", "Cannot be caused"], correct: 1 },
        { id: 4, question: "What are viruses?", options: ["Microscopic animals", "Non-living particles of DNA/RNA that require host cells to reproduce", "Always harmless", "Not a threat"], correct: 1 },
        { id: 5, question: "What is genetic engineering?", options: ["Building organisms", "The deliberate modification of an organism's genes using technology", "Only theoretical", "Impossible"], correct: 1 },
        { id: 6, question: "What is gene regulation?", options: ["Gene mutation", "The control of when and how genes are expressed", "Not important", "Doesn't exist"], correct: 1 },
        { id: 7, question: "How do vaccines work?", options: ["They cure all diseases", "They prepare the immune system to recognize and fight specific pathogens", "They're not effective", "They weaken immunity"], correct: 1 }
      ],
      // Biology Lesson 9: Multicellular Organisms
      "Multicellular Organisms": [
        { id: 1, question: "What is a tissue?", options: ["A single cell", "A group of similar cells working together for a specific function", "Only in animals", "A organ system"], correct: 1 },
        { id: 2, question: "What are plant tissues?", options: ["Only found in roots", "Dermal, ground, and vascular tissues that support plant structure and function", "Not important", "Same as animal tissues"], correct: 1 },
        { id: 3, question: "What is the function of the circulatory system?", options: ["Digestion", "Transport of oxygen, nutrients, and waste throughout the body", "Only in humans", "For movement only"], correct: 1 },
        { id: 4, question: "What is the digestive system's role?", options: ["Movement", "Breaking down food and absorbing nutrients for energy and growth", "Only in animals", "Produces waste only"], correct: 1 },
        { id: 5, question: "What does the immune system do?", options: ["Digests food", "Protects the body from pathogens and disease", "Only protects from bacteria", "Not important"], correct: 1 },
        { id: 6, question: "What are the main organs in plants?", options: ["Brain and heart", "Roots, stems, and leaves that absorb water and perform photosynthesis", "Same as animals", "Plants have no organs"], correct: 1 },
        { id: 7, question: "Why is organ specialization important?", options: ["It's not important", "Different organs performing specific functions increases organism efficiency and survival", "All cells do the same thing", "Reduces capability"], correct: 1 }
      ],
      // Biology Lesson 10: Animal Systems & Behavior
      "Animal Systems & Behavior": [
        { id: 1, question: "What is the nervous system?", options: ["Only the brain", "A system that detects stimuli and controls responses through neurons", "Only for movement", "Not important"], correct: 1 },
        { id: 2, question: "What is the endocrine system?", options: ["Similar to nervous system", "A system that regulates body functions through hormones", "Only in humans", "Not present in all animals"], correct: 1 },
        { id: 3, question: "What is reproduction?", options: ["Growth only", "The biological process by which organisms produce offspring", "Only sexual", "Only asexual"], correct: 1 },
        { id: 4, question: "What is the difference between sexual and asexual reproduction?", options: ["No difference", "Sexual requires two parents and produces genetic variation; asexual requires one parent and produces identical offspring", "Not real differences", "Cannot tell them apart"], correct: 1 },
        { id: 5, question: "What is animal behavior?", options: ["How animals look", "The actions and responses of animals to their environment", "Instinctive only", "Never learned"], correct: 1 },
        { id: 6, question: "What is an instinct?", options: ["A learned behavior", "An innate behavior that an organism performs without learning", "Only in humans", "Not biological"], correct: 1 },
        { id: 7, question: "How do animals communicate?", options: ["Only with sound", "Through sound, visual signals, chemical signals, and touch depending on the species", "All animals communicate the same way", "Not important"], correct: 1 }
      ],
      // Chemistry Lesson 11: The Foundations of Matter
      "The Foundations of Matter": [
        { id: 1, question: "What is the central part of an atom called?", options: ["Electron cloud", "The nucleus containing protons and neutrons", "Valence shell", "Orbital"], correct: 1 },
        { id: 2, question: "What is the role of significant figures in chemistry?", options: ["No importance", "To indicate the precision of measured values and calculations", "Only for large numbers", "A style choice"], correct: 1 },
        { id: 3, question: "What does the periodic table organize elements by?", options: ["Alphabetical order", "Atomic number and chemical properties", "Mass only", "Discovery date"], correct: 1 },
        { id: 4, question: "What is an electron in an atom?", options: ["Part of the nucleus", "A negatively charged particle orbiting the nucleus", "Always in the nucleus", "Not part of atoms"], correct: 1 },
        { id: 5, question: "How are elements arranged in the periodic table?", options: ["Randomly", "By atomic number in rows and columns representing electron patterns", "By mass descending", "By discovery order"], correct: 1 },
        { id: 6, question: "What determines the chemical properties of an element?", options: ["Neutrons only", "Protons and electrons, particularly valence electrons", "Mass number", "Nuclear size"], correct: 1 },
        { id: 7, question: "Why is understanding atomic structure important in chemistry?", options: ["Not really important", "It explains how atoms bond and react with other atoms", "Only for physics", "No practical use"], correct: 1 }
      ],
      // Chemistry Lesson 12: Chemical Math & Reactions
      "Chemical Math & Reactions": [
        { id: 1, question: "What is stoichiometry?", options: ["A type of chemical element", "The calculation of quantities in chemical reactions using mole ratios", "A lab technique", "Not important"], correct: 1 },
        { id: 2, question: "What makes a substance a solution?", options: ["Any mixture", "A homogeneous mixture of a solute dissolved in a solvent", "Only liquids can be solutions", "A heterogeneous mixture"], correct: 1 },
        { id: 3, question: "What happens in an acid-base reaction?", options: ["Nothing specific", "An acid donates protons and a base accepts them, forming salt and water", "Only one reactant changes", "Acids and bases don't react"], correct: 1 },
        { id: 4, question: "What is a precipitation reaction?", options: ["Rain falling", "Formation of an insoluble solid (precipitate) from soluble reactants", "Any chemical reaction", "Dissolving a solid"], correct: 1 },
        { id: 5, question: "What are redox reactions?", options: ["Only decomposition", "Reactions involving transfer of electrons between atoms", "Acid-base reactions only", "Not a real reaction type"], correct: 1 },
        { id: 6, question: "How do you balance a chemical equation?", options: ["Add numbers anywhere", "Adjust coefficients to equal atoms on both sides without changing formulas", "Change subscripts", "No balancing needed"], correct: 1 },
        { id: 7, question: "What is the mole and why is it important?", options: ["An animal", "A unit for counting atoms/molecules, essential for quantitative chemistry", "Only theoretical", "Not used in practice"], correct: 1 }
      ],
      // Chemistry Lesson 13: The Language of Gases
      "The Language of Gases": [
        { id: 1, question: "What is the ideal gas law?", options: ["Only theory", "PV = nRT, relating pressure, volume, moles, and temperature", "Not useful", "Only for air"], correct: 1 },
        { id: 2, question: "What does the ideal gas law assume?", options: ["Always perfectly accurate", "Gas particles have negligible volume and experience elastic collisions", "Never true", "No assumptions"], correct: 1 },
        { id: 3, question: "What are real gases?", options: ["Not actual", "Actual gases that deviate from ideal behavior at high pressure or low temperature", "Only theoretical", "Impossible to study"], correct: 1 },
        { id: 4, question: "What is partial pressure?", options: ["Not measurable", "The pressure a single gas contributes in a mixture of gases", "Total pressure divided equally", "Only in pure gases"], correct: 1 },
        { id: 5, question: "How do you solve ideal gas law problems?", options: ["No systematic way", "Identify known variables, rearrange PV = nRT, substitute and solve", "Random guessing", "Only trial and error"], correct: 1 },
        { id: 6, question: "What is Dalton's Law of Partial Pressures?", options: ["Not applicable", "Total pressure equals sum of partial pressures of component gases", "Gases don't mix", "Pressures cancel out"], correct: 1 },
        { id: 7, question: "When do real gases deviate most from ideal behavior?", options: ["Never", "At high pressures or low temperatures", "At all conditions", "Only in labs"], correct: 1 }
      ],
      // Chemistry Lesson 14: Energy & Thermodynamics
      "Energy & Thermodynamics": [
        { id: 1, question: "What is enthalpy?", options: ["Only for reactions", "Heat energy released or absorbed during a chemical reaction", "Not measurable", "Same as temperature"], correct: 1 },
        { id: 2, question: "What is calorimetry?", options: ["Measuring colors", "Measuring heat absorbed or released in chemical or physical processes", "Estimating temperature", "Not a real method"], correct: 1 },
        { id: 3, question: "What is entropy?", options: ["Order only", "A measure of disorder or randomness in a system", "Only in closed systems", "Always increases"], correct: 1 },
        { id: 4, question: "What is the first law of thermodynamics?", options: ["Energy disappears", "Energy cannot be created or destroyed, only transformed", "Energy always increases", "Not applicable"], correct: 1 },
        { id: 5, question: "What is an exothermic reaction?", options: ["Absorbs heat", "Releases heat energy to surroundings", "All reactions", "Impossible"], correct: 1 },
        { id: 6, question: "What is an endothermic reaction?", options: ["Releases heat", "Absorbs heat energy from surroundings", "All reactions", "Not common"], correct: 1 },
        { id: 7, question: "How does temperature relate to molecular motion?", options: ["No relation", "Higher temperature means faster molecular motion and more kinetic energy", "Opposite effect", "No correlation"], correct: 1 }
      ],
      // Chemistry Lesson 15: Bonding & Molecular Structure
      "Bonding & Molecular Structure": [
        { id: 1, question: "What is a covalent bond?", options: ["Complete electron transfer", "Sharing of electrons between atoms", "Loss of electrons", "Attraction to nucleus"], correct: 1 },
        { id: 2, question: "What is an ionic bond?", options: ["Sharing electrons", "Electrostatic attraction between positive and negative ions", "Temporary", "Only in metals"], correct: 1 },
        { id: 3, question: "What is a polar molecule?", options: ["At the poles", "A molecule with uneven electron distribution creating partial charges", "All asymmetrical molecules", "Non-existent"], correct: 1 },
        { id: 4, question: "What are Lewis structures?", options: ["Only for formulas", "Diagrams showing valence electrons and bonding in molecules", "Not useful", "Complicated notation"], correct: 1 },
        { id: 5, question: "What is molecular geometry?", options: ["Map-based", "The 3D arrangement of atoms in a molecule", "Only 2D structures", "Not important"], correct: 1 },
        { id: 6, question: "What are orbitals?", options: ["Orbital paths of electrons", "Regions where electrons are likely to be found", "Perfect circles", "Not real"], correct: 1 },
        { id: 7, question: "How do electronegativity differences determine bond type?", options: ["They don't", "Large differences create ionic bonds; small differences create covalent bonds", "All bonds are the same", "Irrelevant"], correct: 1 }
      ],
      // Chemistry Lesson 16: Phases of Matter
      "Phases of Matter": [
        { id: 1, question: "What are the main properties of liquids?", options: ["No definite shape or volume", "Definite volume but no definite shape", "Rigid structure", "Always flowing"], correct: 1 },
        { id: 2, question: "What is a solution in chemistry?", options: ["Any mixture", "A homogeneous mixture where a solute is dissolved in a solvent", "Heterogeneous only", "A pure substance"], correct: 1 },
        { id: 3, question: "What is chemical equilibrium?", options: ["One-directional reaction", "A state where forward and reverse reactions occur at equal rates", "No reactions occur", "Reactions always proceed"], correct: 1 },
        { id: 4, question: "What does an equilibrium constant (K) indicate?", options: ["Only temperature", "The ratio of products to reactants at equilibrium", "Reaction speed", "Not meaningful"], correct: 1 },
        { id: 5, question: "How does pressure affect equilibrium?", options: ["Never affects it", "Shifts equilibrium to side with fewer moles of gas", "Always shifts right", "No effect"], correct: 1 },
        { id: 6, question: "How does temperature affect equilibrium?", options: ["No effect", "Shifts equilibrium; exothermic reactions shift left when heated", "Always shifts right", "Predictable only for one type"], correct: 1 },
        { id: 7, question: "What is Le Chatelier's Principle?", options: ["Not applicable", "Systems respond to disturbances by shifting to counteract the change", "Changes are resisted equally", "No predictions possible"], correct: 1 }
      ],
      // Chemistry Lesson 17: Acids, Bases, & Kinetics
      "Acids, Bases, & Kinetics": [
        { id: 1, question: "What is pH?", options: ["A compound", "A logarithmic measure of hydrogen ion concentration", "Only for bases", "Not related to acidity"], correct: 1 },
        { id: 2, question: "What is pOH?", options: ["Not a real measurement", "A logarithmic measure of hydroxide ion concentration", "Same as pH", "Only in strong bases"], correct: 1 },
        { id: 3, question: "What is a buffer solution?", options: ["Only acidic", "A solution that resists pH changes when small amounts of acid or base are added", "Cannot exist", "Always neutral"], correct: 1 },
        { id: 4, question: "What does kinetics study?", options: ["Molecular structure only", "The rates of chemical reactions and factors affecting them", "Equilibrium only", "Not relevant"], correct: 1 },
        { id: 5, question: "What is a reaction rate?", options: ["Always constant", "The speed at which reactants are converted to products", "Measured in degrees", "Not quantifiable"], correct: 1 },
        { id: 6, question: "What is an activation energy?", options: ["Energy released by reaction", "Minimum energy required for a reaction to occur", "Energy of products", "Not important"], correct: 1 },
        { id: 7, question: "How do catalysts affect reaction rates?", options: ["They slow reactions", "They increase reaction rate by lowering activation energy without being consumed", "They're permanent", "No effect"], correct: 1 }
      ],
      // Chemistry Lesson 18: Advanced Atomic Theory & Electricity
      "Advanced Atomic Theory & Electricity": [
        { id: 1, question: "What is electrochemistry?", options: ["Only electrolysis", "The study of reactions involving electron transfer and electricity", "Not applied", "Theoretical only"], correct: 1 },
        { id: 2, question: "What is a redox reaction?", options: ["Only oxidation", "A reaction where electrons are transferred between species", "Only reduction", "No electron transfer"], correct: 1 },
        { id: 3, question: "What is oxidation?", options: ["Only oxygen involvement", "Loss of electrons by an atom or ion", "Gain of electrons", "Corrosion only"], correct: 1 },
        { id: 4, question: "What is reduction?", options: ["Loss of electrons", "Gain of electrons by an atom or ion", "Oxidation in reverse", "Only in labs"], correct: 1 },
        { id: 5, question: "What are periodic trends?", options: ["Random variations", "Predictable patterns in element properties based on position in periodic table", "No patterns exist", "Only in main groups"], correct: 1 },
        { id: 6, question: "What is electronegativity?", options: ["Reactivity only", "An atom's ability to attract electrons in a chemical bond", "Same as ionization energy", "Not measurable"], correct: 1 },
        { id: 7, question: "How does atomic radius change across a period?", options: ["Always increases", "Generally decreases left to right", "No pattern", "Increases then decreases"], correct: 1 }
      ],
      // Chemistry Lesson 19: Nuclear Chemistry & Organic Intro
      "Nuclear Chemistry & Organic Intro": [
        { id: 1, question: "What is nuclear chemistry?", options: ["Study of bonding", "The study of nuclear reactions, radioactivity, and atomic transformations", "Not a real field", "Only theoretical"], correct: 1 },
        { id: 2, question: "What is radioactivity?", options: ["Only dangerous", "Emission of particles or radiation from unstable nuclei", "Not natural", "Rare"], correct: 1 },
        { id: 3, question: "What is an alkane?", options: ["Charged molecule", "A hydrocarbon containing only single bonds between carbons", "Contains rings only", "Not organic"], correct: 1 },
        { id: 4, question: "What is an alkene?", options: ["Single bonds only", "A hydrocarbon containing at least one carbon-carbon double bond", "Aromatic only", "Not common"], correct: 1 },
        { id: 5, question: "What is an alkyne?", options: ["Single bonds only", "A hydrocarbon containing at least one carbon-carbon triple bond", "Same as alkene", "Rare in nature"], correct: 1 },
        { id: 6, question: "What are aromatic compounds?", options: ["Smell only", "Compounds containing benzene rings with delocalized electrons", "All organic compounds", "Not stable"], correct: 1 },
        { id: 7, question: "Why is carbon so versatile in chemistry?", options: ["It's not", "It forms four bonds and can bond with itself creating complex structures", "Only one type of bond", "Limited applications"], correct: 1 }
      ],
      // Chemistry Lesson 20: Organic Chemistry & Global Cycles
      "Organic Chemistry & Global Cycles": [
        { id: 1, question: "What is nomenclature in organic chemistry?", options: ["Classification only", "The systematic naming of organic compounds based on structure", "Not standardized", "Too complicated"], correct: 1 },
        { id: 2, question: "What are functional groups?", options: ["Not important", "Specific groups of atoms that determine the properties and reactions of organic compounds", "Only in polymers", "Rare"], correct: 1 },
        { id: 3, question: "What is a polymer?", options: ["Simple molecule", "A large molecule made of many repeating units (monomers) bonded together", "Only synthetic", "Not studied"], correct: 1 },
        { id: 4, question: "What is the carbon cycle?", options: ["Not important", "The circulation of carbon between atmosphere, organisms, and Earth through various processes", "Only in oceans", "Man-made only"], correct: 1 },
        { id: 5, question: "How do hydrocarbons relate to energy?", options: ["Not related", "They are the primary source of chemical energy through combustion", "Only coal burns", "No energy content"], correct: 1 },
        { id: 6, question: "What is organic synthesis?", options: ["Natural only", "The creation of complex organic molecules through planned chemical reactions", "Impossible artificially", "Theory only"], correct: 1 },
        { id: 7, question: "Why is understanding organic chemistry important?", options: ["Not necessary", "Organic molecules are the basis of all living things and many materials we use", "Only for biologists", "No real applications"], correct: 1 }
      ],
      // Physics Lesson 21: One-Dimensional Motion & Calculus
      "One-Dimensional Motion & Calculus": [
        { id: 1, question: "What is kinematics?", options: ["Study of forces", "Study of motion without considering causes", "Only projectile motion", "Not a real field"], correct: 1 },
        { id: 2, question: "What is the difference between displacement and distance?", options: ["No difference", "Displacement is vector (straight line); distance is scalar (total path)", "Same concept", "Not related"], correct: 1 },
        { id: 3, question: "What is acceleration?", options: ["Only speeding up", "Rate of change of velocity over time", "Always positive", "Same as velocity"], correct: 1 },
        { id: 4, question: "What does a derivative represent in motion?", options: ["Not used", "Instantaneous rate of change (velocity from position)", "Only for theoretical use", "No physical meaning"], correct: 1 },
        { id: 5, question: "What are Newton's three laws of motion?", options: ["Not proven", "Inertia, F=ma, action-reaction", "Only two laws", "No laws"], correct: 1 },
        { id: 6, question: "What is a vector?", options: ["Only numbers", "Quantity with magnitude and direction", "Always speeds", "One-dimensional"], correct: 1 },
        { id: 7, question: "How does calculus relate to physics?", options: ["Not related", "Used to describe motion and changes continuously", "Only theory", "No applications"], correct: 1 }
      ],
      // Physics Lesson 22: Forces, Friction & Circular Motion
      "Forces, Friction & Circular Motion": [
        { id: 1, question: "What is friction?", options: ["Not a force", "Resistance force opposing motion between surfaces", "Always helpful", "Can be eliminated"], correct: 1 },
        { id: 2, question: "What types of friction exist?", options: ["Only one type", "Static (stationary objects) and kinetic (moving objects)", "No distinction", "Only kinetic"], correct: 1 },
        { id: 3, question: "What is centripetal acceleration?", options: ["Outward force", "Acceleration toward center required for circular motion", "Always zero", "Away from center"], correct: 1 },
        { id: 4, question: "What is centripetal force?", options: ["Outward", "Net inward force causing circular motion", "Imaginary", "Not real"], correct: 1 },
        { id: 5, question: "What is gravitational force?", options: ["Only on Earth", "Attractive force between masses (F=Gm1m2/r²)", "Repulsive", "Weak"], correct: 1 },
        { id: 6, question: "What is work in physics?", options: ["Job", "Force times displacement in direction of force (W=Fd cosθ)", "No physical meaning", "Energy only"], correct: 1 },
        { id: 7, question: "What is power?", options: ["Strength only", "Rate at which work is done (P=W/t)", "Same as force", "Not measurable"], correct: 1 }
      ],
      // Physics Lesson 23: Momentum & Rotational Mechanics
      "Momentum & Rotational Mechanics": [
        { id: 1, question: "What is momentum?", options: ["Energy", "Product of mass and velocity (p=mv)", "Only for moving objects", "Always conserved"], correct: 1 },
        { id: 2, question: "What is conservation of momentum?", options: ["Never applies", "In closed systems, total momentum before equals after collision", "Only in some cases", "Theoretical only"], correct: 1 },
        { id: 3, question: "What is the difference between elastic and inelastic collisions?", options: ["No difference", "Elastic conserves KE; inelastic doesn't", "Same outcome", "Only one type exists"], correct: 1 },
        { id: 4, question: "What is torque?", options: ["Only force", "Rotational equivalent of force (τ=rF sinθ)", "Not important", "Same as force"], correct: 1 },
        { id: 5, question: "What is angular momentum?", options: ["Linear only", "Rotational equivalent of momentum (L=Iω)", "Not conserved", "Unrelated to momentum"], correct: 1 },
        { id: 6, question: "What is rotational inertia (moment of inertia)?", options: ["Not important", "Resistance to rotational motion (I=Σmr²)", "Same as mass", "Only for cylinders"], correct: 1 },
        { id: 7, question: "What is equilibrium in statics?", options: ["Unbalanced", "Object at rest with no net force or torque", "Moving uniformly", "Always unstable"], correct: 1 }
      ],
      // Physics Lesson 24: Fluids & Oscillations
      "Fluids & Oscillations": [
        { id: 1, question: "What is pressure?", options: ["Only liquids", "Force per unit area (P=F/A)", "Not measurable", "Always atmospheric"], correct: 1 },
        { id: 2, question: "What is Pascal's Principle?", options: ["Not applicable", "Pressure applied to incompressible fluid transmits equally throughout", "Only for gases", "Theoretical"], correct: 1 },
        { id: 3, question: "What is buoyancy?", options: ["Weight only", "Upward force exerted by fluid on submerged object", "Downward", "Fictional"], correct: 1 },
        { id: 4, question: "What is Archimedes' Principle?", options: ["Only for ships", "Buoyant force equals weight of displaced fluid", "Doesn't apply to gases", "Theoretical only"], correct: 1 },
        { id: 5, question: "What is simple harmonic motion (SHM)?", options: ["Random motion", "Repetitive motion about equilibrium where F=-kx", "Only circular", "No pattern"], correct: 1 },
        { id: 6, question: "What is a wave?", options: ["Water only", "Disturbance propagating through medium or space", "Always mechanical", "Never travels"], correct: 1 },
        { id: 7, question: "What are wave properties?", options: ["Not important", "Wavelength, frequency, amplitude, speed", "Only wavelength", "Not measurable"], correct: 1 }
      ],
      // Physics Lesson 25: Sound & Thermal Physics
      "Sound & Thermal Physics": [
        { id: 1, question: "What is sound?", options: ["Light only", "Mechanical longitudinal waves traveling through medium", "Only visible", "Travels in vacuum"], correct: 1 },
        { id: 2, question: "What is frequency?", options: ["Wavelength", "Number of oscillations per unit time (f=1/T)", "Always constant", "In hertz only"], correct: 1 },
        { id: 3, question: "What is the Doppler Effect?", options: ["Not real", "Change in frequency when source/observer move relative to each other", "Only for light", "No practical use"], correct: 1 },
        { id: 4, question: "What is temperature?", options: ["Heat", "Measure of average kinetic energy of particles", "Only in Celsius", "Not measurable"], correct: 1 },
        { id: 5, question: "What is thermal energy?", options: ["Not real", "Total internal energy due to random particle motion", "Only potential", "Same as heat"], correct: 1 },
        { id: 6, question: "What is phase change?", options: ["Temperature increase", "Transition between solid, liquid, gas states", "Only melting", "Always reversible"], correct: 1 },
        { id: 7, question: "What is latent heat?", options: ["No heat", "Energy absorbed/released during phase change without temperature change", "Only for heating", "Not important"], correct: 1 }
      ],
      // Physics Lesson 26: Thermodynamics & Electrostatics
      "Thermodynamics & Electrostatics": [
        { id: 1, question: "What is the First Law of Thermodynamics?", options: ["Heat always increases", "ΔU = Q - W; energy conservation with heat and work", "Heat is separate", "No conservation"], correct: 1 },
        { id: 2, question: "What is entropy?", options: ["Order only", "Measure of disorder; increases in isolated systems", "Always decreases", "Not measurable"], correct: 1 },
        { id: 3, question: "What is electric charge?", options: ["Only atoms", "Fundamental property of matter; positive or negative", "Continuous", "Only electrons"], correct: 1 },
        { id: 4, question: "What is Coulomb's Law?", options: ["Not applicable", "F = kq1q2/r²; force between charges", "Only attraction", "Never repulsion"], correct: 1 },
        { id: 5, question: "What is an electric field?", options: ["Not real", "Region where electric force acts on charges", "Only inside conductors", "Cannot be measured"], correct: 1 },
        { id: 6, question: "What does electric potential represent?", options: ["Not useful", "Energy per unit charge (V=U/q)", "Only kinetic", "Not measurable"], correct: 1 },
        { id: 7, question: "What is electrostatic equilibrium?", options: ["Impossible", "Excess charge on conductor rests on surface; no field inside", "Charges everywhere", "No equilibrium"], correct: 1 }
      ],
      // Physics Lesson 27: Voltage & DC Circuits
      "Voltage & DC Circuits": [
        { id: 1, question: "What is voltage (potential difference)?", options: ["Force only", "Energy per unit charge between two points (V=W/q)", "Same as current", "Not measurable"], correct: 1 },
        { id: 2, question: "What is electric current?", options: ["Voltage", "Flow of charge per unit time (I=Q/t)", "Always AC", "Same as resistance"], correct: 1 },
        { id: 3, question: "What is resistance?", options: ["Not important", "Opposition to current flow (R=V/I)", "Helps current", "Always zero"], correct: 1 },
        { id: 4, question: "What is Ohm's Law?", options: ["Not true", "V = IR; voltage equals current times resistance", "Only approximation", "Disproven"], correct: 1 },
        { id: 5, question: "What is electrical power?", options: ["No meaning", "Rate of energy transfer (P=VI=I²R=V²/R)", "Only potential", "Not calculated"], correct: 1 },
        { id: 6, question: "What is a capacitor?", options: ["Resistor", "Device storing electrical charge and energy", "Blocks current", "Not used"], correct: 1 },
        { id: 7, question: "What are Kirchhoff's Rules?", options: ["Not valid", "Conservation of charge and energy in circuits", "Optional", "Only theory"], correct: 1 }
      ],
      // Physics Lesson 28: Magnetism & Induction
      "Magnetism & Induction": [
        { id: 1, question: "What is magnetism?", options: ["Only Earth", "Force exerted by moving charges and magnetic materials", "Repulsion only", "Not fundamental"], correct: 1 },
        { id: 2, question: "What is magnetic force on a moving charge?", options: ["No force", "F = qvB sinθ; perpendicular to both velocity and field", "Same as electric", "Not measurable"], correct: 1 },
        { id: 3, question: "What is Ampere's Law?", options: ["Not useful", "Magnetic field created by electric current", "Only for wires", "Theoretical only"], correct: 1 },
        { id: 4, question: "What is electromagnetic induction?", options: ["Not real", "Change in magnetic flux induces EMF and current", "Impossible", "Theoretical"], correct: 1 },
        { id: 5, question: "What is Faraday's Law?", options: ["Not accurate", "EMF = -dΦ/dt; induced EMF from changing magnetic flux", "Only for magnets", "Disproven"], correct: 1 },
        { id: 6, question: "What is Lenz's Law?", options: ["Not applicable", "Induced current opposes change in magnetic flux", "Helps change", "Theoretical only"], correct: 1 },
        { id: 7, question: "What are Maxwell's Equations?", options: ["Not important", "Four fundamental equations unifying electricity and magnetism", "Only approximation", "Never proven"], correct: 1 }
      ],
      // Physics Lesson 29: Optics & Light Behavior
      "Optics & Light Behavior": [
        { id: 1, question: "What is light?", options: ["Only visible", "Electromagnetic wave and particle (photon)", "Only particles", "Only waves"], correct: 1 },
        { id: 2, question: "What is the speed of light?", options: ["Variable", "3 × 10⁸ m/s in vacuum (constant c)", "Faster in denser media", "Slower than sound"], correct: 1 },
        { id: 3, question: "What is refraction?", options: ["Bending away", "Bending of light as it enters different medium", "Same as reflection", "No bending"], correct: 1 },
        { id: 4, question: "What is Snell's Law?", options: ["Not valid", "n1sinθ1 = n2sinθ2; relates angles and refractive indices", "Only approximate", "Theoretical"], correct: 1 },
        { id: 5, question: "What is diffraction?", options: ["Not real", "Bending of light around obstacles and through openings", "Only refraction", "Impossible"], correct: 1 },
        { id: 6, question: "What is interference?", options: ["Not observable", "Superposition of waves creating constructive/destructive patterns", "Only in mechanics", "Theoretical only"], correct: 1 },
        { id: 7, question: "What is the photoelectric effect?", options: ["Not real", "Emission of electrons when light hits material", "Light doesn't affect", "Theoretical only"], correct: 1 }
      ],
      // Physics Lesson 30: Modern Physics & Relativity
      "Modern Physics & Relativity": [
        { id: 1, question: "What is relativity?", options: ["Not important", "Physics describing motion at high speeds and strong gravity", "Only theory", "Disproven"], correct: 1 },
        { id: 2, question: "What is time dilation?", options: ["Illusion", "Time passes slower for fast-moving objects relative to stationary observer", "No effect", "Theoretical only"], correct: 1 },
        { id: 3, question: "What is length contraction?", options: ["Not real", "Objects shorten in direction of motion at high speeds", "Only apparent", "Impossible"], correct: 1 },
        { id: 4, question: "What is E=mc²?", options: ["Not important", "Equivalence of mass and energy; mass converts to energy", "Only for atoms", "Theoretical"], correct: 1 },
        { id: 5, question: "What is quantum mechanics?", options: ["Not applicable", "Physics of atoms and subatomic particles", "Only theory", "No applications"], correct: 1 },
        { id: 6, question: "What is Planck's constant?", options: ["Not useful", "Fundamental constant relating energy to frequency (h=6.63×10⁻³⁴ J·s)", "Only theoretical", "Not measured"], correct: 1 },
        { id: 7, question: "What is wave-particle duality?", options: ["Not real", "Matter and energy exhibit both wave and particle properties", "Only waves", "Only particles"], correct: 1 }
      ],
      // Environmental Science Lesson 31: Foundations & The History of Life
      "Foundations & The History of Life": [
        { id: 1, question: "What is the study of organisms called?", options: ["Geology", "Biology and zoology", "Only taxonomy", "Not a science"], correct: 1 },
        { id: 2, question: "What are the key characteristics of plants?", options: ["Moving", "Photosynthetic, multicellular, with cell walls", "Like animals", "No structure"], correct: 1 },
        { id: 3, question: "What defines an animal?", options: ["Immobile", "Heterotrophic, multicellular organisms without cell walls", "Only eats plants", "Cannot move"], correct: 1 },
        { id: 4, question: "How long has life existed on Earth?", options: ["Millions of years", "Over 3.8 billion years", "Recent", "Not long"], correct: 1 },
        { id: 5, question: "What is comparative anatomy?", options: ["No relevance", "Studying similarities and differences in organism structure revealing evolution", "Only appearance", "Not useful"], correct: 1 },
        { id: 6, question: "What were the first animals like?", options: ["Like humans", "Simple aquatic invertebrates appearing 600 million years ago", "Large dinosaurs", "Not studied"], correct: 1 },
        { id: 7, question: "Why is understanding life history important?", options: ["Not important", "Shows how organisms adapted and evolved over time", "Only academic", "No value"], correct: 1 }
      ],
      // Environmental Science Lesson 32: Plant Biology & Evolution
      "Plant Biology & Evolution": [
        { id: 1, question: "What is photosynthesis?", options: ["Breakdown", "Process converting light energy into chemical energy (glucose)", "Only in animals", "Not efficient"], correct: 1 },
        { id: 2, question: "What are plant cells?", options: ["Same as animal cells", "Cells with chloroplasts, cell walls, large vacuoles", "No differences", "Not important"], correct: 1 },
        { id: 3, question: "How did plants evolve?", options: ["Did not evolve", "Transitioned from water to land with adaptations for survival", "Only recently", "No evidence"], correct: 1 },
        { id: 4, question: "What are plant tissues?", options: ["Not important", "Dermal, ground, and vascular tissues with specific functions", "All the same", "Not distinct"], correct: 1 },
        { id: 5, question: "What are vascular plants?", options: ["Not real", "Plants with xylem and phloem for transport", "Only trees", "Cannot exist"], correct: 1 },
        { id: 6, question: "What is the significance of plant evolution?", options: ["No significance", "Enabled colonization of land and provided oxygen to atmosphere", "Unimportant", "Not relevant"], correct: 1 },
        { id: 7, question: "How do plants transport water and nutrients?", options: ["They don't", "Through vascular tissue (xylem and phloem)", "Only absorption", "Not measurable"], correct: 1 }
      ],
      // Environmental Science Lesson 33: Botany - Reproduction & Senses
      "Botany - Reproduction & Senses": [
        { id: 1, question: "What is the function of flowers?", options: ["Only beauty", "Reproduction through pollen and seed production", "No function", "Just decoration"], correct: 1 },
        { id: 2, question: "What are fruits and seeds?", options: ["Only food", "Structures for seed dispersal and new plant generation", "Not important", "Same thing"], correct: 1 },
        { id: 3, question: "How do plants sense their environment?", options: ["They don't", "Through hormones responding to light, gravity, touch", "No mechanisms", "Not proven"], correct: 1 },
        { id: 4, question: "What is plant stress?", options: ["Not real", "Response to adverse conditions like drought or pests", "Always fatal", "Cannot adapt"], correct: 1 },
        { id: 5, question: "What is the plant-fungi relationship?", options: ["No relationship", "Symbiotic; fungi help plants absorb nutrients", "Always harmful", "Only parasitic"], correct: 1 },
        { id: 6, question: "What are plant hormones?", options: ["Not important", "Chemical messengers controlling growth, flowering, ripening", "Only in animals", "Not diverse"], correct: 1 },
        { id: 7, question: "Why is plant reproduction important?", options: ["Not important", "Ensures species continuation and genetic diversity", "Only academic", "No practical value"], correct: 1 }
      ],
      // Environmental Science Lesson 34: Zoology - Insects to Reptiles
      "Zoology - Insects to Reptiles": [
        { id: 1, question: "What characteristics define insects?", options: ["Four legs", "Six legs, exoskeleton, three body parts", "Eight legs", "No structure"], correct: 1 },
        { id: 2, question: "What are arthropods?", options: ["No real group", "Animals with jointed limbs and exoskeletons", "Only insects", "Not diverse"], correct: 1 },
        { id: 3, question: "What is the difference between fish and amphibians?", options: ["No difference", "Fish water-only; amphibians live both water and land", "Same habitat", "Not distinct"], correct: 1 },
        { id: 4, question: "What characteristics do reptiles have?", options: ["No specific traits", "Dry skin, cold-blooded, eggs with leathery shells", "Always wet", "Not defined"], correct: 1 },
        { id: 5, question: "What makes birds unique?", options: ["Flight only", "Feathers, hollow bones, egg-laying, warm-blooded", "Large size", "Not special"], correct: 1 },
        { id: 6, question: "What are the characteristics of mammals?", options: ["No defining traits", "Hair, milk production, warm-blooded, varied reproduction", "Fur only", "Not diverse"], correct: 1 },
        { id: 7, question: "Where do humans fit in animal classification?", options: ["Not important", "Primates within mammals with specific adaptations", "Not related to animals", "Separate"], correct: 1 }
      ],
      // Environmental Science Lesson 35: Zoology - Behavior & Interaction
      "Zoology - Behavior & Interaction": [
        { id: 1, question: "What is animal behavior?", options: ["Not studied", "Actions and responses shaped by genetics and environment", "Only instinctive", "No patterns"], correct: 1 },
        { id: 2, question: "What is behavioral ecology?", options: ["Not real", "Study of animal behavior in ecological context", "Only biology", "No applications"], correct: 1 },
        { id: 3, question: "How do animals communicate?", options: ["They don't", "Through sound, visual displays, chemical signals, touch", "Only vocalization", "Not diverse"], correct: 1 },
        { id: 4, question: "What is migration?", options: ["Not common", "Seasonal movement of animals for resources or reproduction", "Random movement", "Declining"], correct: 1 },
        { id: 5, question: "What is extreme survival?", options: ["Rare", "Adaptations allowing survival in harsh environments", "Not possible", "Fictional"], correct: 1 },
        { id: 6, question: "What is domestication?", options: ["Not real", "Selective breeding of animals for human purposes", "Natural evolution", "No effects"], correct: 1 },
        { id: 7, question: "Why study animal behavior?", options: ["Not important", "Understanding interactions, conservation, human-animal relationships", "Only academic", "No practical use"], correct: 1 }
      ],
      // Environmental Science Lesson 36: Ecology - Populations & Growth
      "Ecology - Populations & Growth": [
        { id: 1, question: "What is population ecology?", options: ["Individual study", "Study of populations and their dynamics", "Not a field", "Only theory"], correct: 1 },
        { id: 2, question: "What is human population growth?", options: ["Steady", "Exponential increase; currently 8 billion", "Declining", "Not changing"], correct: 1 },
        { id: 3, question: "What is carrying capacity?", options: ["What organisms carry", "Maximum population size an environment supports", "Unlimited", "Not measurable"], correct: 1 },
        { id: 4, question: "What is predation?", options: ["Cooperation", "Hunter-prey interaction affecting both populations", "Not common", "No effects"], correct: 1 },
        { id: 5, question: "What is herbivory?", options: ["Animals eating", "Consumption of plants by animals", "Not predation", "Rare"], correct: 1 },
        { id: 6, question: "What is ecological succession?", options: ["Never happens", "Sequential change in community species composition", "Only deserts", "Unpredictable"], correct: 1 },
        { id: 7, question: "Why is population management important?", options: ["Not important", "Prevents overexploitation and maintains ecosystem health", "Only academic", "No applications"], correct: 1 }
      ],
      // Environmental Science Lesson 37: Ecology - Ecosystems & Cycles
      "Ecology - Ecosystems & Cycles": [
        { id: 1, question: "What is ecosystem ecology?", options: ["Not real", "Study of ecosystems and energy/nutrient flow", "Only organisms", "No patterns"], correct: 1 },
        { id: 2, question: "What is the water cycle?", options: ["Not important", "Evaporation, condensation, precipitation circulation", "Only rain", "Unrelated"], correct: 1 },
        { id: 3, question: "What is the carbon cycle?", options: ["Not relevant", "Circulation of carbon through atmosphere, organisms, soil", "Only plants", "Static"], correct: 1 },
        { id: 4, question: "What is the nitrogen cycle?", options: ["Not important", "Circulation of nitrogen through nitrogen fixation and assimilation", "Only bacteria", "No role"], correct: 1 },
        { id: 5, question: "What is the phosphorus cycle?", options: ["Not studied", "Circulation of phosphorus through rocks, soil, organisms", "Only animals", "Rare"], correct: 1 },
        { id: 6, question: "What is the relationship between plants and carbon?", options: ["No relationship", "Plants fix CO2 through photosynthesis; affect atmospheric cycles", "Only oxygen", "Not important"], correct: 1 },
        { id: 7, question: "How does agriculture affect ecosystems?", options: ["No effect", "Alters nutrient cycles, biodiversity, and soil health", "Always beneficial", "Only improves"], correct: 1 }
      ],
      // Environmental Science Lesson 38: Biomes & Biodiversity
      "Biomes & Biodiversity": [
        { id: 1, question: "What is a biome?", options: ["Single ecosystem", "Large region with similar climate and organisms", "Only rainforests", "Not defined"], correct: 1 },
        { id: 2, question: "What are major global biomes?", options: ["Only deserts", "Rainforests, grasslands, tundra, desert, temperate forest", "Same everywhere", "Not distinct"], correct: 1 },
        { id: 3, question: "What is plant biodiversity?", options: ["Not important", "Variety of plant species in biome", "Always decreasing", "No value"], correct: 1 },
        { id: 4, question: "What is conservation zoology?", options: ["Not real", "Protecting animal species and populations from extinction", "Only academic", "Ineffective"], correct: 1 },
        { id: 5, question: "What is pollution?", options: ["Not an issue", "Introduction of harmful substances into environment", "Always natural", "No effects"], correct: 1 },
        { id: 6, question: "What is conservation biology?", options: ["Not a science", "Science of protecting biodiversity and ecosystems", "Only preserving", "Theoretical only"], correct: 1 },
        { id: 7, question: "Why is biodiversity important?", options: ["Not important", "Provides ecosystem services, resilience, and resources for humans", "Only beautiful", "No practical value"], correct: 1 }
      ],
      // Environmental Science Lesson 39: The Future of Life
      "The Future of Life": [
        { id: 1, question: "What are major threats to biodiversity?", options: ["No threats", "Habitat loss, climate change, pollution, overexploitation", "Not documented", "Exaggerated"], correct: 1 },
        { id: 2, question: "What is climate change impact on life?", options: ["No impact", "Species extinction, ecosystem disruption, habitat shifts", "Only beneficial", "Minimal"], correct: 1 },
        { id: 3, question: "What is sustainable development?", options: ["Not possible", "Meeting present needs without compromising future", "Only economic", "No environmental"], correct: 1 },
        { id: 4, question: "What role do humans play in ecosystems?", options: ["Neutral", "Major impact through resource use and habitat modification", "Only consumers", "Insignificant"], correct: 1 },
        { id: 5, question: "What are conservation strategies?", options: ["Not effective", "Protected areas, restoration, sustainable practices", "Always fail", "No solutions"], correct: 1 },
        { id: 6, question: "What is the importance of predicting future changes?", options: ["Not important", "Allows adaptation and mitigation planning for environmental challenges", "Impossible", "No use"], correct: 1 },
        { id: 7, question: "What can individuals do for environmental protection?", options: ["Nothing matters", "Reduce consumption, support conservation, make sustainable choices", "No impact", "Pointless"], correct: 1 }
      ],
      // Economics Lesson 41: The Foundation of Choice
      "The Foundation of Choice": [
        { id: 1, question: "What is economics fundamentally about?", options: ["Money only", "Study of how societies manage scarce resources and make choices", "Not scientific", "No basis"], correct: 1 },
        { id: 2, question: "What is the concept of opportunity cost?", options: ["Not real", "The value of the next best alternative foregone when making a choice", "Same as cost", "Irrelevant"], correct: 1 },
        { id: 3, question: "What is specialization and comparative advantage?", options: ["Not efficient", "Focusing on what you do best; enables trade and increases total production", "Only for large economies", "Doesn't help"], correct: 1 },
        { id: 4, question: "How do supply and demand determine prices?", options: ["Randomly", "Equilibrium where quantity supplied equals demanded determines market price", "Government sets all", "No pattern"], correct: 1 },
        { id: 5, question: "What are the basic economic systems?", options: ["No differences", "Command (centrally planned), Market (free), Mixed (combination)", "All the same", "Undefined"], correct: 1 },
        { id: 6, question: "What is the purpose of economic institutions?", options: ["No purpose", "Organize production, distribution, and exchange of goods/services", "Only enforce laws", "Not needed"], correct: 1 },
        { id: 7, question: "Why is understanding choice important in economics?", options: ["Not important", "All economic activity involves choosing how to allocate limited resources", "Obvious", "No relevance"], correct: 1 }
      ],
      // Economics Lesson 42: Measuring Economic Health
      "Measuring Economic Health": [
        { id: 1, question: "What is Gross Domestic Product (GDP)?", options: ["Not useful", "Total monetary value of all goods and services produced in a country annually", "Only includes goods", "Theoretical"], correct: 1 },
        { id: 2, question: "What is inflation and how is it measured?", options: ["Not important", "General increase in price levels; measured using Consumer Price Index", "Always bad", "Static"], correct: 1 },
        { id: 3, question: "What is productivity?", options: ["Speed only", "Output per unit of input; key to economic growth and living standards", "Not measurable", "Irrelevant"], correct: 1 },
        { id: 4, question: "What are economic indicators?", options: ["Not useful", "Statistics showing economic health: unemployment, GDP growth, inflation", "Just one measure", "No meaning"], correct: 1 },
        { id: 5, question: "What is the business cycle?", options: ["Fixed pattern", "Alternating periods of expansion and contraction in economic activity", "Linear growth only", "Not real"], correct: 1 },
        { id: 6, question: "How do economists measure poverty?", options: ["Subjective", "Using poverty line: income threshold for basic needs", "No standard", "Impossible"], correct: 1 },
        { id: 7, question: "What is the relationship between growth and welfare?", options: ["Always positive", "GDP growth indicates economic expansion but may not reflect true well-being", "Same thing", "No connection"], correct: 1 }
      ],
      // Economics Lesson 43: Government & Fiscal Policy
      "Government & Fiscal Policy": [
        { id: 1, question: "What is fiscal policy?", options: ["Not important", "Government use of taxes and spending to influence economy and stabilize growth", "Only taxation", "No effect"], correct: 1 },
        { id: 2, question: "How do taxes and spending affect the economy?", options: ["No relationship", "Spending stimulates demand; taxes reduce spending; balance determines multiplier effect", "Same impact", "Unpredictable"], correct: 1 },
        { id: 3, question: "What is a budget deficit?", options: ["Not real", "Government spending exceeds revenue; requires borrowing", "Always good", "Normal"], correct: 1 },
        { id: 4, question: "What are government subsidies and their effects?", options: ["Harmful only", "Payments supporting industries/groups; can help or distort markets", "Always beneficial", "No impact"], correct: 1 },
        { id: 5, question: "What is progressive vs. regressive taxation?", options: ["Same", "Progressive: higher % on wealthy (reduces inequality); regressive: opposite effect", "No difference", "Not relevant"], correct: 1 },
        { id: 6, question: "What are price controls?", options: ["Market-based", "Government-set max (ceiling) or min (floor) prices; can cause shortages/surpluses", "Never used", "Effective always"], correct: 1 },
        { id: 7, question: "How can fiscal policy address unemployment?", options: ["Can't help", "Stimulus spending increases demand and employment; tax cuts increase disposable income", "No effect", "Unpredictable"], correct: 1 }
      ],
      // Economics Lesson 44: Money, Banking & The Fed
      "Money, Banking & The Fed": [
        { id: 1, question: "What is money and what are its functions?", options: ["Not important", "Medium of exchange, store of value, unit of account enabling commerce", "Only physical", "Theoretical"], correct: 1 },
        { id: 2, question: "What is the role of the Federal Reserve?", options: ["Just a bank", "Central bank controlling monetary policy, regulating banks, managing money supply", "No importance", "Not needed"], correct: 1 },
        { id: 3, question: "What is monetary policy?", options: ["Not useful", "Central bank tools (interest rates, open market operations) to control economy", "Only taxation", "No effect"], correct: 1 },
        { id: 4, question: "How do interest rates affect economic activity?", options: ["Not related", "Higher rates discourage borrowing/spending; lower rates stimulate", "Same effect", "No pattern"], correct: 1 },
        { id: 5, question: "What caused the 2008 financial crisis?", options: ["Not understood", "Subprime mortgages, excessive leverage, housing bubble burst, banking collapse", "Natural disaster", "Unpredictable"], correct: 1 },
        { id: 6, question: "What is inflation targeting?", options: ["Not used", "Central bank sets target inflation rate to balance growth and price stability", "No targets", "Theoretical"], correct: 1 },
        { id: 7, question: "How do banks create money?", options: ["They don't", "Through lending: deposits are lent out, creating new credit/money in system", "Only government", "No mechanism"], correct: 1 }
      ],
      // Economics Lesson 45: Global Markets & Trade
      "Global Markets & Trade": [
        { id: 1, question: "What are the benefits of international trade?", options: ["No benefits", "Specialization, lower prices, broader consumer choice, economic efficiency", "Always harmful", "Only costs"], correct: 1 },
        { id: 2, question: "What is the balance of trade?", options: ["No importance", "Difference between exports and imports; deficit/surplus affects currency", "Always balanced", "Irrelevant"], correct: 1 },
        { id: 3, question: "How do exchange rates work?", options: ["Fixed always", "Relative values of currencies; determined by supply/demand in forex markets", "No variation", "Random"], correct: 1 },
        { id: 4, question: "What is protectionism and what are its effects?", options: ["Always good", "Protecting domestic industries via tariffs/quotas; can reduce competition but raise prices", "Never used", "No effect"], correct: 1 },
        { id: 5, question: "What is comparative advantage?", options: ["Not real", "Ability to produce at lower opportunity cost; basis for mutually beneficial trade", "Same as absolute", "Theoretical"], correct: 1 },
        { id: 6, question: "How does globalization affect economies?", options: ["No effect", "Increases trade, capital flows, job creation in some areas but disruption in others", "Always positive", "Only negative"], correct: 1 },
        { id: 7, question: "What are trade agreements?", options: ["Not useful", "Formal arrangements between countries reducing barriers and promoting trade", "Harmless only", "No benefits"], correct: 1 }
      ],
      // Economics Lesson 46: Microeconomics - Firms & Costs
      "Microeconomics - Firms & Costs": [
        { id: 1, question: "What are the types of costs a firm faces?", options: ["Not important", "Fixed costs (independent of output) and variable costs (dependent on output)", "Only one type", "No distinction"], correct: 1 },
        { id: 2, question: "What is marginal cost and revenue?", options: ["Not relevant", "Change in cost/revenue from producing one more unit; where MC=MR determines profit", "Same thing", "No relationship"], correct: 1 },
        { id: 3, question: "What are economies of scale?", options: ["Not possible", "Per-unit costs decrease with larger production due to efficiency gains", "Never happen", "Cost increases"], correct: 1 },
        { id: 4, question: "What is profit maximization?", options: ["Not a goal", "Firms optimize when marginal revenue equals marginal cost (MR=MC)", "At any point", "Not possible"], correct: 1 },
        { id: 5, question: "What is market structure and how does it matter?", options: ["No importance", "Competition level (perfect, monopolistic, oligopoly) determines pricing power and behavior", "All identical", "Not relevant"], correct: 1 },
        { id: 6, question: "What is human capital?", options: ["Not important", "Skills, education, training of workers; increases productivity and earning potential", "Only physical capital", "No value"], correct: 1 },
        { id: 7, question: "What are externalities and how do they affect markets?", options: ["Not real", "Side effects (positive/negative) on third parties not reflected in market prices", "Markets account for all", "No impact"], correct: 1 }
      ],
      // Economics Lesson 47: Competition & Market Structures
      "Competition & Market Structures": [
        { id: 1, question: "What is perfect competition?", options: ["Not real", "Many small firms, free entry/exit, identical products, price-takers", "Never occurs", "Theoretical"], correct: 1 },
        { id: 2, question: "What is monopoly and why does it occur?", options: ["Not harmful", "Single seller with market power; from barriers to entry, patents, scale", "No barriers", "Always bad"], correct: 1 },
        { id: 3, question: "What is oligopoly?", options: ["Few companies", "Few large firms dominating market; interdependent pricing/strategy", "Many competitors", "Not common"], correct: 1 },
        { id: 4, question: "What is monopolistic competition?", options: ["No such thing", "Many firms with differentiated products; some market power but many competitors", "Same as perfect", "Theoretical"], correct: 1 },
        { id: 5, question: "What is game theory?", options: ["Just games", "Mathematical analysis of strategic interactions where outcomes depend on all players' choices", "Not applicable", "No use"], correct: 1 },
        { id: 6, question: "What are barriers to entry?", options: ["Don't exist", "Obstacles (cost, regulation, patents, scale) preventing new competition", "Easy to overcome", "No effect"], correct: 1 },
        { id: 7, question: "How does competition affect innovation?", options: ["Hinders it", "Drives innovation as firms seek competitive advantage", "No relationship", "Prevents discovery"], correct: 1 }
      ],
      // Economics Lesson 48: Inequality & Human Welfare
      "Inequality & Human Welfare": [
        { id: 1, question: "What measures income inequality?", options: ["Not measurable", "Gini coefficient (0=equal, 1=unequal) and income distribution curves", "Only median income", "No way"], correct: 1 },
        { id: 2, question: "What causes economic inequality?", options: ["Nothing", "Differences in education, capital access, health, discrimination, market forces", "Always random", "Not understood"], correct: 1 },
        { id: 3, question: "What is social mobility?", options: ["Geographic movement", "Ability to move between social/economic classes; affects opportunity and inequality", "Not important", "Fixed always"], correct: 1 },
        { id: 4, question: "How does healthcare affect the economy?", options: ["No effect", "Health improves productivity; healthcare costs affect inequality and growth", "Independent", "Not related"], correct: 1 },
        { id: 5, question: "What is poverty and how is it measured?", options: ["Subjective only", "Inability to meet basic needs; measured by absolute/relative poverty lines", "Not quantifiable", "Obvious"], correct: 1 },
        { id: 6, question: "What are social safety nets and their purpose?", options: ["Not useful", "Programs (welfare, unemployment, healthcare) protecting vulnerable from poverty", "Harmful always", "Ineffective"], correct: 1 },
        { id: 7, question: "How can societies reduce inequality?", options: ["Can't", "Progressive taxation, education, healthcare access, anti-discrimination policies", "Impossible", "Not related"], correct: 1 }
      ],
      // Economics Lesson 49: Behavioral Econ & Data
      "Behavioral Econ & Data": [
        { id: 1, question: "What does behavioral economics study?", options: ["Not scientific", "How psychology influences economic decisions and deviations from rationality", "Only mathematics", "Theoretical only"], correct: 1 },
        { id: 2, question: "What are cognitive biases?", options: ["Not real", "Mental patterns causing systematic deviations from rational judgment (anchoring, heuristics)", "No effect", "Imaginary"], correct: 1 },
        { id: 3, question: "What is the sharing economy?", options: ["Not important", "Platform-based model enabling asset sharing (Airbnb, Uber) reducing underutilization", "New necessity", "No growth"], correct: 1 },
        { id: 4, question: "How should we interpret correlation vs. causation?", options: ["Same thing", "Correlation indicates relationship but doesn't prove causation; requires careful analysis", "Never related", "Always causal"], correct: 1 },
        { id: 5, question: "What is big data and its economic impact?", options: ["Not important", "Large datasets enabling prediction, targeting, market insights for competitive advantage", "Useless", "No value"], correct: 1 },
        { id: 6, question: "How do statistics relate to economic analysis?", options: ["Not needed", "Statistics describe data patterns, test hypotheses, and support policy decisions", "Only for math", "Separate fields"], correct: 1 },
        { id: 7, question: "What are the risks of misusing statistical claims?", options: ["No risks", "Cherry-picking data, misleading visualization, confusing correlation cause errors", "Never happens", "Statistical purity"], correct: 1 }
      ],
      // Economics Lesson 50: The Future of the Global Economy
      "The Future of the Global Economy": [
        { id: 1, question: "What is the gig economy?", options: ["Temporary only", "Flexible work arrangement with independent contractors via platforms", "Not growing", "Declining"], correct: 1 },
        { id: 2, question: "How does automation affect employment?", options: ["No effect", "Eliminates some jobs but creates new ones; disrupts workers, benefits consumers", "Always negative", "Only positive"], correct: 1 },
        { id: 3, question: "What is sustainable development?", options: ["Not feasible", "Growth meeting present needs without harming future generations' resources", "Only environmental", "Economic only"], correct: 1 },
        { id: 4, question: "What is cryptocurrency and its economic significance?", options: ["No significance", "Digital decentralized currency challenging traditional finance; volatile but growing", "Just speculation", "No future"], correct: 1 },
        { id: 5, question: "What are emerging markets and their importance?", options: ["Not significant", "Rapidly developing economies (BRICS) offering growth, opportunities, and challenges", "Declining", "Irrelevant"], correct: 1 },
        { id: 6, question: "How does urbanization affect global economy?", options: ["No effect", "Rural-to-urban migration creates demand, growth in services, but inequality challenges", "Not related", "Only rural"], correct: 1 },
        { id: 7, question: "What is the circular economy?", options: ["Not possible", "Model reducing waste through reuse, recycling, sustainable design instead of linear consumption", "Old concept", "Inefficient"], correct: 1 }
      ],
      // History Lesson 51: Ancient Roots & Natural Philosophy
      "Ancient Roots & Natural Philosophy": [
        { id: 1, question: "What was natural philosophy?", options: ["Not scientific", "Inquiry into nature's causes using observation and reasoning before modern science", "Religious only", "No basis"], correct: 1 },
        { id: 2, question: "What were Aristotle's contributions to natural philosophy?", options: ["Nothing important", "Systematic observation and logic-based classification of nature and causation", "Always wrong", "Theoretical only"], correct: 1 },
        { id: 3, question: "What role did Islamic scholars play in scientific history?", options: ["No role", "Preserved Greek knowledge, made advances in mathematics, astronomy, medicine during Dark Ages", "Only religious", "Not scientists"], correct: 1 },
        { id: 4, question: "How did Roman engineering advance knowledge?", options: ["Not scientific", "Practical innovations in architecture, aqueducts demonstrated applied physics", "No learning", "Just building"], correct: 1 },
        { id: 5, question: "What was the geocentric model?", options: ["Not wrong", "Earth-centered universe with celestial spheres; dominant for ~1500 years", "Modern view", "Correct"], correct: 1 },
        { id: 6, question: "Why was the Middle Ages called the Dark Ages scientifically?", options: ["Not true", "Knowledge preservation declined in Europe; scientific progress slowed significantly", "Most advanced", "Better than now"], correct: 1 },
        { id: 7, question: "How did ancient civilizations contribute to astronomy?", options: ["Not at all", "Babylonians, Egyptians mapped constellations, predicted eclipses, tracked planets", "Modern discovery", "No basis"], correct: 1 }
      ],
      // History Lesson 52: The Scientific Revolution Begins
      "The Scientific Revolution Begins": [
        { id: 1, question: "What was the Scientific Revolution?", options: ["Not important", "Period (1500s-1700s) shifting from ancient authority to observation and experiment", "Recent event", "Slow change"], correct: 1 },
        { id: 2, question: "What was Copernicus's heliocentric model?", options: ["Wrong", "Sun-centered solar system; challenged Church authority and Aristotelian view", "Earth-centered", "Not accepted"], correct: 1 },
        { id: 3, question: "What did Tycho Brahe contribute to astronomy?", options: ["Not much", "Precise observational data without telescopes; provided foundation for laws of motion", "Only theory", "No observations"], correct: 1 },
        { id: 4, question: "Why was the printing press important for science?", options: ["No impact", "Enabled rapid idea dissemination, comparison, criticism across scholars globally", "Only for books", "Not scientific"], correct: 1 },
        { id: 5, question: "What role did the Renaissance play in scientific revival?", options: ["Not important", "Renewed interest in classical knowledge, humanism, experimentation, individual inquiry", "Medieval", "No science"], correct: 1 },
        { id: 6, question: "How did the Reformation affect scientific thought?", options: ["No effect", "Challenged authority, encouraged individual interpretation, supported empiricism", "Only religious", "Hindered"], correct: 1 },
        { id: 7, question: "What was the empirical method?", options: ["Not reliable", "Knowledge from observation and experiment rather than authority or pure reason", "Too slow", "Inefficient"], correct: 1 }
      ],
      // History Lesson 53: Physics, Light & Gravity
      "Physics, Light & Gravity": [
        { id: 1, question: "What were Galileo's key contributions to physics?", options: ["Not important", "Inertia, free fall law, telescopic observations, challenging Aristotle's errors", "All wrong", "Theoretical only"], correct: 1 },
        { id: 2, question: "What were Kepler's Laws of Planetary Motion?", options: ["Not accurate", "Elliptical orbits, areas swept in equal time, period-distance relationship", "Circular only", "Disproven"], correct: 1 },
        { id: 3, question: "What was Newton's major achievement?", options: ["Not important", "Unified heavenly and earthly motion with gravity and laws of motion", "Only math", "Theoretical"], correct: 1 },
        { id: 4, question: "What is Newton's Law of Universal Gravitation?", options: ["Not real", "Every object attracts with force proportional to masses, inversely to distance squared", "Only on Earth", "Approximate"], correct: 1 },
        { id: 5, question: "What advances did Newton make in optics?", options: ["Not many", "Prism experiments showing white light is spectrum; developed reflecting telescope", "Only theory", "No discoveries"], correct: 1 },
        { id: 6, question: "How did Newton develop calculus?", options: ["Not needed", "Mathematical tool to describe changing quantities; essential for physics", "Just algebra", "No contribution"], correct: 1 },
        { id: 7, question: "What impact did Newtonian physics have on philosophy?", options: ["No impact", "Mechanistic deterministic worldview; shaped Enlightenment thought", "Only science", "Philosophical only"], correct: 1 }
      ],
      // History Lesson 54: Chemistry & The Unseen World
      "Chemistry & The Unseen World": [
        { id: 1, question: "What were alchemists trying to do?", options: ["Nothing useful", "Transmute base metals to gold; developed techniques later used in chemistry", "Modern chemistry", "Successful"], correct: 1 },
        { id: 2, question: "What did Robert Boyle contribute to chemistry?", options: ["Not much", "Gas laws relating pressure, volume, temperature; challenged ancient 'elements'", "Only law", "Theoretical"], correct: 1 },
        { id: 3, question: "What was Lavoisier's major discovery?", options: ["Not important", "Oxygen's role in combustion; law of conservation of mass in chemical reactions", "Only elements", "Theoretical only"], correct: 1 },
        { id: 4, question: "What is the periodic table's history?", options: ["Ancient", "Mendeleev organized elements by properties, predicted missing ones; refined with atomic theory", "Modern invention", "Not useful"], correct: 1 },
        { id: 5, question: "What did Dalton's Atomic Theory propose?", options: ["Not real", "Elements composed of indivisible atoms; each element has unique atoms with characteristic mass", "Still accurate", "Disproven"], correct: 1 },
        { id: 6, question: "How did chemistry explain reactions scientifically?", options: ["Can't", "Atoms rearrange in definite ratios; mass conserved; predicted new compounds", "Just observations", "No patterns"], correct: 1 },
        { id: 7, question: "Why was chemistry crucial for technological advancement?", options: ["Not important", "Understanding materials enabled industrial processes, medicines, materials science", "Only academic", "No applications"], correct: 1 }
      ],
      // History Lesson 55: Biology, Life & Deep Time
      "Biology, Life & Deep Time": [
        { id: 1, question: "What was the Cell Theory?", options: ["Not important", "All organisms made of cells; cells from pre-existing cells; fundamental unit of life", "Not proven", "Theoretical"], correct: 1 },
        { id: 2, question: "How did geology establish Deep Time?", options: ["Not proven", "Rock formations show Earth's age in millions of years; challenged biblical chronology", "Young Earth", "Not accepted"], correct: 1 },
        { id: 3, question: "What did Lamarck propose about evolution?", options: ["Correct", "Inheritance of acquired traits; incorrect mechanism but important evolutionary thinking", "Modern view", "Disproven completely"], correct: 1 },
        { id: 4, question: "What was Darwin's revolutionary insight?", options: ["Not new", "Natural selection explains evolution without design; variation + environment = adaptation", "Only observation", "Controversial"], correct: 1 },
        { id: 5, question: "What evidence did Darwin present for evolution?", options: ["Not conclusive", "Fossils, homologous structures, embryology, biogeography, artificial selection", "Only anecdotes", "Insufficient"], correct: 1 },
        { id: 6, question: "How did evolution challenge prevailing worldviews?", options: ["Didn't", "Removed human exceptionalism; unified all life; mechanistic cause replacing design", "Accepted immediately", "No impact"], correct: 1 },
        { id: 7, question: "Why was evolution controversial despite evidence?", options: ["Still accepted", "Conflicted with religious creation stories; threatened human dignity perception", "Only science", "No conflict"], correct: 1 }
      ],
      // History Lesson 56: Medicine & The Human Body
      "Medicine & The Human Body": [
        { id: 1, question: "What was germ theory?", options: ["Not real", "Microorganisms cause disease; revolutionized medicine and public health", "Always known", "Disproven"], correct: 1 },
        { id: 2, question: "What did Pasteur accomplish in microbiology?", options: ["Not important", "Identified disease bacteria, developed vaccines, pasteurization process", "Only theory", "No applications"], correct: 1 },
        { id: 3, question: "How did vaccination history begin?", options: ["Modern", "Jenner's smallpox vaccine (1796) using cowpox; proven germ theory", "Ancient method", "Not effective"], correct: 1 },
        { id: 4, question: "What was Mendel's work on genetics?", options: ["Not important", "Laws of inheritance using pea plants; foundation of modern genetics", "Wrong mechanism", "Only observation"], correct: 1 },
        { id: 5, question: "What was the structure of DNA?", options: ["Never determined", "Watson, Crick, Franklin: double helix with base pairing; explained heredity mechanism", "Much later", "Theoretical"], correct: 1 },
        { id: 6, question: "What enabled modern biotechnology?", options: ["Magic", "DNA sequencing, recombinant DNA, PCR; allowed genetic engineering and medicine", "Too difficult", "Not possible"], correct: 1 },
        { id: 7, question: "How did medicine transform through microscopy?", options: ["Not much", "Bacteria, cells, viruses revealed; enabled diagnosis, vaccines, antibiotics", "Just observation", "No change"], correct: 1 }
      ],
      // History Lesson 57: Electricity & Thermodynamics
      "Electricity & Thermodynamics": [
        { id: 1, question: "What was the history of understanding electricity?", options: ["Not understood", "From static observations to Volta's battery to Faraday's induction to modern electronics", "Always obvious", "No progress"], correct: 1 },
        { id: 2, question: "What did Faraday discover about magnetism and electricity?", options: ["Not related", "Electromagnetic induction: changing magnetic fields create electric fields and vice versa", "Same phenomenon", "Separate forces"], correct: 1 },
        { id: 3, question: "What was the significance of Ohm's Law?", options: ["Not important", "Relationship between voltage, current, resistance; enabled circuit design", "Just algebra", "Theoretical only"], correct: 1 },
        { id: 4, question: "How did electricity enable technological revolution?", options: ["Not crucial", "Telegraph, electric light, motors, power generation transformed society", "No impact", "Minor role"], correct: 1 },
        { id: 5, question: "What is thermodynamics and why does it matter?", options: ["Not important", "Laws governing heat, energy, entropy; explains engines, refrigeration, life processes", "Just heat", "No applications"], correct: 1 },
        { id: 6, question: "What was the steam engine's historical importance?", options: ["Not significant", "Powered Industrial Revolution; transformed manufacturing, transportation, society", "Only for trains", "Limited impact"], correct: 1 },
        { id: 7, question: "How did energy science advance understanding?", options: ["No advance", "Conservation laws unified mechanics, heat, electricity into unified framework", "Just observations", "No pattern"], correct: 1 }
      ],
      // History Lesson 58: The Modern Physics Revolution
      "The Modern Physics Revolution": [
        { id: 1, question: "What was the Michelson-Morley Experiment?", options: ["Proved ether", "Showed light speed constant; could not detect ether; challenged classical mechanics", "No significance", "Inconclusive"], correct: 1 },
        { id: 2, question: "What were Einstein's theories about?", options: ["Only relativity", "Special relativity (space-time), general relativity (gravity as geometry), mass-energy equivalence", "Not revolutionary", "Theoretical only"], correct: 1 },
        { id: 3, question: "What is the quantum mechanical revolution?", options: ["Not important", "Atomic scale described by probability, uncertainty, quantized energy; not deterministic", "Classical mechanics", "Still accurate"], correct: 1 },
        { id: 4, question: "What was Planck's contribution to physics?", options: ["Not important", "Quantum hypothesis: energy quantized in discrete units (photons)", "Disproven", "Only math"], correct: 1 },
        { id: 5, question: "What did Bohr model do for atomic understanding?", options: ["Nothing new", "Explained hydrogen spectrum using quantized electron orbits; transitional model", "Completely accurate", "Theoretical"], correct: 1 },
        { id: 6, question: "How did quantum mechanics challenge classical certainty?", options: ["Didn't", "Heisenberg uncertainty, superposition, entanglement replaced determinism", "Always uncertain", "Philosophical only"], correct: 1 },
        { id: 7, question: "What was the significance of E=mc²?", options: ["Just equation", "Mass and energy interchangeable; explained nuclear energy, atomic weapons", "No application", "Theoretical"], correct: 1 }
      ],
      // History Lesson 59: Information & The Digital Age
      "Information & The Digital Age": [
        { id: 1, question: "What was the history of computing?", options: ["Recent", "From mechanical calculators to Turing machine theory to electronic computers to modern AI", "Not important", "Just math"], correct: 1 },
        { id: 2, question: "What did Alan Turing contribute to computing?", options: ["Not much", "Turing machine concept; universal computation; computational theory foundation", "Only code", "Theoretical"], correct: 1 },
        { id: 3, question: "How did transistors and integrated circuits evolve?", options: ["Not important", "Enabled miniaturization, Moore's Law progression, exponential computing power increase", "No change", "Random improvement"], correct: 1 },
        { id: 4, question: "What was the internet's revolutionary impact?", options: ["Minor", "Global connectivity, information access, commerce, communication; transformed society", "Just email", "Overstated"], correct: 1 },
        { id: 5, question: "What is information theory?", options: ["Not important", "Shannon's framework quantifying information, compression, transmission, entropy", "Only communication", "Philosophical"], correct: 1 },
        { id: 6, question: "How did artificial intelligence begin?", options: ["Recently", "Turing test, early AI research in 1950s-60s; evolved through winters and booms", "Not possible", "Modern only"], correct: 1 },
        { id: 7, question: "What impact did digitalization have on knowledge?", options: ["No impact", "Democratized information access, enabled global collaboration, transformed research", "Only academics", "Minimal effect"], correct: 1 }
      ],
      // History Lesson 60: Science in the 21st Century
      "Science in the 21st Century": [
        { id: 1, question: "What are the major scientific challenges today?", options: ["None left", "Climate change, disease, energy, aging, clean water, sustainable development", "All solved", "Minor issues"], correct: 1 },
        { id: 2, question: "How has climate science developed?", options: ["Not scientific", "Evidence-based understanding of greenhouse gases, feedback loops, human impact", "No consensus", "Just opinions"], correct: 1 },
        { id: 3, question: "What is the role of big data in science?", options: ["Not important", "Enables pattern discovery, AI prediction, interdisciplinary insights, personalized medicine", "Only statistics", "Overrated"], correct: 1 },
        { id: 4, question: "What advances have occurred in genetics?", options: ["Not much", "Gene sequencing, CRISPR editing, genomic medicine, personalized treatments", "Still theoretical", "No applications"], correct: 1 },
        { id: 5, question: "What is the future of space exploration?", options: ["Finished", "Commercial spaceflight, Mars missions, exoplanet search, expanding human presence", "Too expensive", "Not possible"], correct: 1 },
        { id: 6, question: "How does artificial intelligence transform science?", options: ["No impact", "Accelerates discovery through pattern recognition, simulation, hypothesis generation", "Just hype", "Unproven"], correct: 1 },
        { id: 7, question: "What is the relationship between science and ethics?", options: ["No connection", "Science power requires ethical frameworks; dual-use concerns, equitable access", "Science is value-neutral", "Not important"], correct: 1 }
      ],
      // Human Geography Lesson 61: Tools of the Geographer
      "Tools of the Geographer": [
        { id: 1, question: "What is geography as a discipline?", options: ["Just maps", "Study of Earth's physical features, human societies, and spatial relationships", "Only physical", "Social studies only"], correct: 1 },
        { id: 2, question: "What are Geographic Information Systems (GIS)?", options: ["Not useful", "Computer tools analyzing spatial data, mapping patterns, decision support", "Only maps", "Theoretical"], correct: 1 },
        { id: 3, question: "What is cartography and why does it matter?", options: ["Not important", "Art/science of mapmaking; map projections affect representation of space", "Perfect replication", "No distortion"], correct: 1 },
        { id: 4, question: "What is scale in geography?", options: ["Not relevant", "Level of analysis from local to global; same phenomena differ at different scales", "Always global", "Same everywhere"], correct: 1 },
        { id: 5, question: "What are map projections and their limitations?", options: ["Accurate always", "Different methods represent curved Earth on flat maps; each distorts some properties", "No distortion", "All equivalent"], correct: 1 },
        { id: 6, question: "How do geographers use fieldwork?", options: ["Not scientific", "Direct observation and data collection revealing patterns and local knowledge", "Just photos", "Unnecessary"], correct: 1 },
        { id: 7, question: "What is human-physical geography integration?", options: ["Separate fields", "Understanding how humans and environment interact in creating landscapes", "Only environment", "Only people"], correct: 1 }
      ],
      // Human Geography Lesson 62: Earth's Tectonic & Surface Systems
      "Earth's Tectonic & Surface Systems": [
        { id: 1, question: "What is plate tectonics theory?", options: ["Not real", "Earth's crust divided into plates that move, creating continents, earthquakes, mountains", "Stationary", "Debunked"], correct: 1 },
        { id: 2, question: "What are tectonic plate boundaries?", options: ["Not important", "Divergent (spreading), convergent (colliding), transform (sliding); different hazards", "Only one type", "No hazards"], correct: 1 },
        { id: 3, question: "How does the rock cycle operate?", options: ["Not cyclical", "Igneous-metamorphic-sedimentary-igneous transformation through Earth processes", "Linear process", "Doesn't repeat"], correct: 1 },
        { id: 4, question: "What causes weathering and erosion?", options: ["Not natural", "Physical/chemical breakdown and transport of rock; shapes landscapes over time", "Doesn't happen", "Reversible"], correct: 1 },
        { id: 5, question: "What are different landforms and their formation?", options: ["Not created", "Mountains, valleys, plateaus, plains from tectonic and erosional processes", "Random distribution", "No causes"], correct: 1 },
        { id: 6, question: "How do soils develop and what determines soil types?", options: ["No formation", "Parent material, climate, organisms, topography, time create different soil profiles", "All identical", "Unchanging"], correct: 1 },
        { id: 7, question: "What is the importance of geology for human settlement?", options: ["No importance", "Resources, hazard risk, soil quality, water availability determine habitability", "No influence", "Irrelevant"], correct: 1 }
      ],
      // Human Geography Lesson 63: Atmosphere, Climate & Change
      "Atmosphere, Climate & Change": [
        { id: 1, question: "What is the difference between weather and climate?", options: ["Same thing", "Weather is short-term atmospheric conditions; climate is long-term patterns", "No difference", "Interchangeable"], correct: 1 },
        { id: 2, question: "What causes global wind and pressure patterns?", options: ["Not explained", "Solar heating creates temperature differences driving circulation (trade winds, jet streams)", "Random", "No pattern"], correct: 1 },
        { id: 3, question: "What are climate zones and how are they classified?", options: ["Not useful", "Tropical, arid, temperate, polar based on temperature and precipitation patterns", "No classification", "Arbitrary"], correct: 1 },
        { id: 4, question: "What is the greenhouse effect and human impact?", options: ["Not real", "Gases trap heat; humans increase CO2, methane enhancing warming", "Natural only", "No evidence"], correct: 1 },
        { id: 5, question: "What are biomes and how do they relate to climate?", options: ["Not connected", "Ecosystems defined by climate (rainforest, desert, tundra); reflect environmental conditions", "No relationship", "Random distribution"], correct: 1 },
        { id: 6, question: "How is climate change affecting human geography?", options: ["No effect", "Sea level rise, migration, resource stress, food security threaten human populations", "Minor issue", "Temporary"], correct: 1 },
        { id: 7, question: "What can communities do about climate change?", options: ["Nothing", "Mitigation (reduce emissions), adaptation (prepare), resilience building", "Futile", "Individual only"], correct: 1 }
      ],
      // Human Geography Lesson 64: The Hydrosphere & Moving Water
      "The Hydrosphere & Moving Water": [
        { id: 1, question: "What is the water cycle?", options: ["Not cyclical", "Evaporation-precipitation-flow cycle; essential for all life and climates", "Linear process", "Stopped"], correct: 1 },
        { id: 2, question: "What are different river systems and their effects?", options: ["Not important", "Rivers shape landscapes, provide water, create hazards (floods), support ecosystems", "No impact", "Unchanging"], correct: 1 },
        { id: 3, question: "What role do glaciers play in Earth systems?", options: ["Minor", "Store freshwater, shape terrain, regulate sea level, affect climate", "Not important", "Disappearing"], correct: 1 },
        { id: 4, question: "What is groundwater and why does it matter?", options: ["Not important", "Underground water supply; often exceeds surface water; vulnerability to pollution", "Endless supply", "No use"], correct: 1 },
        { id: 5, question: "What are ocean currents and their effects?", options: ["Not important", "Heat transport affecting climate, nutrient cycling, fisheries, navigation", "Local only", "No influence"], correct: 1 },
        { id: 6, question: "What causes coastal erosion and flooding?", options: ["Not predictable", "Sea level, storms, waves, human development interact causing hazards", "No causes", "Random"], correct: 1 },
        { id: 7, question: "What are water resource challenges?", options: ["No challenges", "Scarcity, pollution, conflicting use, climate impacts, equity issues", "Unlimited", "No problems"], correct: 1 }
      ],
      // Human Geography Lesson 65: Biogeography & Land Use
      "Biogeography & Land Use": [
        { id: 1, question: "What is biogeography?", options: ["Not scientific", "Study of species distribution, evolution, migration across Earth", "Only observation", "Theoretical"], correct: 1 },
        { id: 2, question: "How does land use change impact ecosystems?", options: ["No impact", "Deforestation, urbanization, agriculture fragment habitats, reduce biodiversity", "Beneficial always", "No effects"], correct: 1 },
        { id: 3, question: "What is agriculture and how does it affect land?", options: ["Minor effect", "Food production; causes deforestation, soil depletion, pollution, biodiversity loss", "No problems", "Environmental"], correct: 1 },
        { id: 4, question: "What is industrial agriculture and its consequences?", options: ["Efficient only", "Monocultures, chemicals, equipment; high yield but environmental damage", "No downsides", "Sustainable"], correct: 1 },
        { id: 5, question: "What is sustainable farming?", options: ["Not viable", "Practices minimizing environmental impact: organic, rotation, conservation", "Always less productive", "Impossible"], correct: 1 },
        { id: 6, question: "What role do forests play globally?", options: ["Not important", "Carbon storage, biodiversity, climate regulation, resources; threatened by clearing", "Expendable", "Replaceable"], correct: 1 },
        { id: 7, question: "How can conservation protect biodiversity?", options: ["Can't preserve", "Protected areas, corridors, restoration, sustainable use, community involvement", "Too late", "Futile"], correct: 1 }
      ],
      // Human Geography Lesson 66: Human Population & Movement
      "Human Population & Movement": [
        { id: 1, question: "What is demography?", options: ["Not important", "Study of population: size, growth, distribution, composition, movement", "Only statistics", "No patterns"], correct: 1 },
        { id: 2, question: "What is the demographic transition model?", options: ["Not applicable", "Population stages: high birth/death → declining death → declining birth → stable", "All countries same", "Not real"], correct: 1 },
        { id: 3, question: "What causes migration and what are its effects?", options: ["No causes", "Pull/push factors; impacts on both origin and destination communities", "Random movement", "No effects"], correct: 1 },
        { id: 4, question: "What is urbanization and why does it occur?", options: ["Not important", "Rural-urban shift; economic opportunities, services concentration, higher density", "Not happening", "No causes"], correct: 1 },
        { id: 5, question: "What are the challenges of rapid urbanization?", options: ["No problems", "Overcrowding, infrastructure gaps, slums, inequality, environmental stress", "Only benefits", "Easy to manage"], correct: 1 },
        { id: 6, question: "What is a megacity and what are the implications?", options: ["Not common", "Cities with >10 million people; create scale challenges for services, governance, inequality", "Manageable", "No problems"], correct: 1 },
        { id: 7, question: "How does population growth affect resources?", options: ["No relationship", "More people use more resources; sustainability requires balancing growth with capacity", "Infinite resources", "No limits"], correct: 1 }
      ],
      // Human Geography Lesson 67: Cultural & Social Geography
      "Cultural & Social Geography": [
        { id: 1, question: "What is cultural geography?", options: ["Not important", "Study of cultures, beliefs, practices, identities across space and how geography shapes them", "Only anthropology", "Not relevant"], correct: 1 },
        { id: 2, question: "What is cultural landscape?", options: ["Not real", "Visible human modifications to environment reflecting culture, values, economic systems", "Only nature", "Invisible"], correct: 1 },
        { id: 3, question: "What is language distribution and its significance?", options: ["No importance", "Geographic pattern of languages; reflects history, migration, identity, power", "No pattern", "Random"], correct: 1 },
        { id: 4, question: "What is religion's geographic significance?", options: ["Not important", "Spatial distribution affects conflict, culture, landscape, social organization", "Everywhere same", "No impact"], correct: 1 },
        { id: 5, question: "What is cultural diffusion and how does it occur?", options: ["Not real", "Cultural traits spread through contact, migration, trade, technology", "Isolated always", "Not happening"], correct: 1 },
        { id: 6, question: "How do gender and space intersect?", options: ["No connection", "Different access to resources, safety, opportunities based on gender and location", "Equal everywhere", "Not related"], correct: 1 },
        { id: 7, question: "What is cultural imperialism and its effects?", options: ["Not real", "Dominant culture spreading, eroding local traditions, languages, identity", "Only positive", "Not happening"], correct: 1 }
      ],
      // Human Geography Lesson 68: Political Geography & Power
      "Political Geography & Power": [
        { id: 1, question: "What is political geography?", options: ["Not important", "Study of territoriality, sovereignty, states, borders, geopolitics, governance", "Only maps", "Not scientific"], correct: 1 },
        { id: 2, question: "What are borders and how are they created?", options: ["Natural always", "Boundaries between states drawn by history, colonialism, treaties, conflict, negotiation", "Permanent", "Invisible"], correct: 1 },
        { id: 3, question: "What is geopolitics?", options: ["Not real", "Analysis of power struggles between nations based on geography, resources, location", "Just conflict", "No pattern"], correct: 1 },
        { id: 4, question: "What are supranational organizations?", options: ["Not important", "Multi-state bodies (UN, EU) addressing transnational issues beyond state control", "No influence", "Powerless"], correct: 1 },
        { id: 5, question: "What is imperialism and colonialism's geographic legacy?", options: ["Not important", "Territorial control created borders, extracted resources, imposed systems, ongoing inequality", "All resolved", "Not related"], correct: 1 },
        { id: 6, question: "What are internal boundaries (regional divisions)?", options: ["No importance", "States subdivide into provinces, states, local areas; affects governance, identity, resources", "Arbitrary", "No function"], correct: 1 },
        { id: 7, question: "How do geography and conflict relate?", options: ["Not connected", "Resources, territory, borders, ethnic/religious geography fuel many conflicts", "Random causes", "Unrelated"], correct: 1 }
      ],
      // Human Geography Lesson 69: Economic Geography & Development
      "Economic Geography & Development": [
        { id: 1, question: "What is economic geography?", options: ["Not important", "Study of production, consumption, distribution, economic activities across space", "Only finance", "Not spatial"], correct: 1 },
        { id: 2, question: "What are economic sectors (primary, secondary, tertiary)?", options: ["Not important", "Resource extraction, manufacturing, services; development stages reflect sector transition", "All the same", "No distinction"], correct: 1 },
        { id: 3, question: "What are global supply chains?", options: ["Not important", "Production networks spanning countries; reflect labor costs, resources, transport efficiency", "Localized", "Not global"], correct: 1 },
        { id: 4, question: "What is development and how is it measured?", options: ["Just income", "GDP per capita, HDI, infrastructure; unequal globally reflecting history, resources, institutions", "Objective measure", "Not measurable"], correct: 1 },
        { id: 5, question: "What are the digital divide and its consequences?", options: ["Not important", "Unequal technology access between rich/poor countries and regions; affects opportunity", "Closing", "No effect"], correct: 1 },
        { id: 6, question: "What are sustainable development goals?", options: ["Not achievable", "UN framework addressing poverty, inequality, climate, health, education, growth", "Too idealistic", "No progress"], correct: 1 },
        { id: 7, question: "How does geography influence inequality?", options: ["No influence", "Location determines resource access, climate, disease burden, development opportunity", "Equal everywhere", "Not related"], correct: 1 }
      ],
      // Human Geography Lesson 70: Urban Environments & The Future
      "Urban Environments & The Future": [
        { id: 1, question: "What is urban structure and how do cities organize?", options: ["No pattern", "Central business district, residential zones, manufacturing; reflects function and history", "All same", "Random"], correct: 1 },
        { id: 2, question: "What is urban planning and its challenges?", options: ["Not needed", "Shaping city growth, land use, infrastructure, equity; increasingly complex", "No challenges", "Easy"], correct: 1 },
        { id: 3, question: "What are smart cities?", options: ["Not real", "Technology-integrated urban systems optimizing services, efficiency, sustainability", "Only future", "Impractical"], correct: 1 },
        { id: 4, question: "What is urban sustainability?", options: ["Not possible", "Cities reducing environmental footprint through transit, energy, waste management", "Never works", "Too expensive"], correct: 1 },
        { id: 5, question: "What are urban inequalities?", options: ["Don't exist", "Slums, homelessness, segregation, unequal services reflecting historical power, investment", "Declining", "No problem"], correct: 1 },
        { id: 6, question: "What is the relationship between cities and climate?", options: ["Not related", "Urban heat islands, emissions concentrated; cities crucial for climate solutions", "Separate issues", "No impact"], correct: 1 },
        { id: 7, question: "What is the future of urban geography?", options: ["Stable", "Continued urbanization, technology integration, climate adaptation, equity challenges", "Declining cities", "No change"], correct: 1 }
      ],
      // Psychology Lesson 71: Intro & Research Methods
      "Intro & Research Methods": [
        { id: 1, question: "What is psychology as a science?", options: ["Just talking", "Systematic study of behavior and mental processes using empirical methods", "Not scientific", "Theoretical only"], correct: 1 },
        { id: 2, question: "What are psychological research methods?", options: ["Not rigorous", "Experiments, correlations, observations, case studies, surveys with controls for bias", "Guessing", "No standards"], correct: 1 },
        { id: 3, question: "What is the role of neuroscience in psychology?", options: ["Not important", "Understanding brain basis of behavior, emotions, cognition through biological methods", "Irrelevant", "Separate field"], correct: 1 },
        { id: 4, question: "What is the brain's basic structure?", options: ["Too complex", "Neurons, neurotransmitters, brain regions (frontal, temporal, etc.) with functions", "Not organized", "Understood completely"], correct: 1 },
        { id: 5, question: "What are neurotransmitters and their importance?", options: ["Not important", "Chemical messengers enabling neuron communication; affect mood, cognition, behavior", "No function", "Theoretical"], correct: 1 },
        { id: 6, question: "What is nature vs. nurture?", options: ["Either alone", "Both genes and environment shape development; ongoing interaction", "Settled debate", "Irrelevant"], correct: 1 },
        { id: 7, question: "Why is ethics important in psychological research?", options: ["Not really", "Protects participants from harm, ensures informed consent, privacy; sets conduct standards", "Always followed", "No importance"], correct: 1 }
      ],
      // Psychology Lesson 72: Sensation & Perception
      "Sensation & Perception": [
        { id: 1, question: "What is the difference between sensation and perception?", options: ["No difference", "Sensation is physical stimulus detection; perception is brain interpretation of sensation", "Same process", "Not related"], correct: 1 },
        { id: 2, question: "What are sensory thresholds?", options: ["Not measurable", "Absolute threshold (minimum to detect); difference threshold (notice change)", "Irrelevant", "No standards"], correct: 1 },
        { id: 3, question: "What is sensory adaptation?", options: ["Not real", "Reduced sensitivity to constant stimulus; allows attention to changes", "Doesn't happen", "Always active"], correct: 1 },
        { id: 4, question: "How do our senses transform physical stimuli?", options: ["Directly", "Transduction: physical energy converted to neural signals the brain interprets", "No transformation", "Unchanged"], correct: 1 },
        { id: 5, question: "What is perceptual organization?", options: ["Random", "Brain groups stimuli (Gestalt), recognizes patterns, creates meaningful wholes", "No organization", "Always aware"], correct: 1 },
        { id: 6, question: "How do past experiences shape perception?", options: ["Not at all", "Expectations and context affect what we perceive (top-down processing)", "No influence", "Irrelevant"], correct: 1 },
        { id: 7, question: "What is the relationship between perception and reality?", options: ["Identical", "Perception is not objective; brain constructs experienced reality from cues", "Always accurate", "Separate"], correct: 1 }
      ],
      // Psychology Lesson 73: Sleep, Altered States & Genetics
      "Sleep, Altered States & Genetics": [
        { id: 1, question: "What is the function of sleep?", options: ["No function", "Memory consolidation, restoration, growth, immune function, temperature regulation", "Just rest", "Wasteful"], correct: 1 },
        { id: 2, question: "What are sleep stages and cycles?", options: ["Not distinct", "NREM (light, deep) and REM; 90-minute cycles with different neural activity", "All the same", "Not measurable"], correct: 1 },
        { id: 3, question: "What are dreams and why do we have them?", options: ["Meaningless", "REM sleep activation; theories: emotion regulation, memory processing, narrative function", "No purpose", "All important"], correct: 1 },
        { id: 4, question: "What are altered states of consciousness?", options: ["Not real", "Meditation, hypnosis, drugs, sleep producing different brain wave patterns", "Only sleep", "Not studied"], correct: 1 },
        { id: 5, question: "How do drugs affect consciousness?", options: ["No effect", "Interact with neurotransmitters; create euphoria, perception changes, dependence risk", "No impact", "Always helpful"], correct: 1 },
        { id: 6, question: "What is epigenetics?", options: ["Genes control all", "Gene expression regulation without DNA change; environment affects heredity", "Not important", "Theoretical"], correct: 1 },
        { id: 7, question: "How do nature and nurture interact in genetics?", options: ["No interaction", "Genes provide potential; environment activates/suppresses expression; complex interplay", "Either/or", "Not related"], correct: 1 }
      ],
      // Psychology Lesson 74: Development & Growth
      "Development & Growth": [
        { id: 1, question: "What is Piaget's theory of cognitive development?", options: ["Outdated", "Stages (sensorimotor, preoperational, concrete, formal) of thinking development", "Still perfect", "Not tested"], correct: 1 },
        { id: 2, question: "What is attachment and why is it important?", options: ["Not important", "Early bond with caregivers; affects emotional security, relationships, mental health", "Only mothers", "No impact"], correct: 1 },
        { id: 3, question: "What are developmental milestones?", options: ["No importance", "Behavioral achievements (crawling, talking, thinking) at typical ages; varies individually", "Rigid stages", "Not measurable"], correct: 1 },
        { id: 4, question: "What is adolescence and its challenges?", options: ["Just age", "Period of physical, emotional, identity changes; peer influence, autonomy seeking", "Easy transition", "No challenges"], correct: 1 },
        { id: 5, question: "What is moral development?", options: ["Fixed", "Kohlberg's stages from punishment-based to principled reasoning; varies by culture", "Not learned", "No growth"], correct: 1 },
        { id: 6, question: "How does parenting affect child development?", options: ["No effect", "Styles (authoritative, authoritarian, permissive) impact emotional, social, academic outcomes", "Irrelevant", "All the same"], correct: 1 },
        { id: 7, question: "What is adulthood and what are life tasks?", options: ["No changes", "Stages (young, middle, late adult) with roles (relationships, work, meaning-making)", "Unchanging", "No development"], correct: 1 }
      ],
      // Psychology Lesson 75: Learning & Memory
      "Learning & Memory": [
        { id: 1, question: "What is classical conditioning?", options: ["Not real", "Neutral stimulus paired with response until it triggers response independently", "Only animals", "Disproven"], correct: 1 },
        { id: 2, question: "What is operant conditioning?", options: ["Not effective", "Behavior modified by consequences: reinforcement increases, punishment decreases", "Only theory", "No applications"], correct: 1 },
        { id: 3, question: "What are the types of memory?", options: ["No types", "Sensory (brief), short-term (limited), long-term (vast); different neural bases", "All the same", "Not distinct"], correct: 1 },
        { id: 4, question: "How is memory encoded, stored, and retrieved?", options: ["Not systematic", "Information converted to neural form, maintained, then accessed through retrieval cues", "Random process", "No process"], correct: 1 },
        { id: 5, question: "What causes forgetting?", options: ["Unknown", "Decay, interference, retrieval failure, suppression; memory is reconstructive", "Never happens", "Permanent"], correct: 1 },
        { id: 6, question: "What is the role of sleep in memory?", options: ["No role", "Sleep consolidates memories, particularly procedural and emotional", "Wasteful for memory", "No effect"], correct: 1 },
        { id: 7, question: "What is metacognition?", options: ["Not important", "Thinking about thinking; monitoring understanding improves learning and memory", "No effect", "Not useful"], correct: 1 }
      ],
      // Psychology Lesson 76: Language, Intelligence & Emotion
      "Language, Intelligence & Emotion": [
        { id: 1, question: "How does language develop?", options: ["Not biological", "Infants acquire sounds, words, grammar through exposure and interaction", "Learned later", "Taught only"], correct: 1 },
        { id: 2, question: "What are theories of intelligence?", options: ["Only IQ", "Multiple intelligences (Sternberg, Gardner), g-factor; nature-nurture debate", "Single ability", "Unchanging"], correct: 1 },
        { id: 3, question: "What does IQ measure and its limitations?", options: ["Everything", "Academic potential; doesn't capture creativity, emotional, practical intelligence", "Perfect measure", "No limits"], correct: 1 },
        { id: 4, question: "What are emotions and their functions?", options: ["Just feelings", "Adaptive responses involving cognition, physiology, expression; motivate behavior", "No purpose", "Harmful"], correct: 1 },
        { id: 5, question: "What is emotional intelligence?", options: ["Not real", "Ability to understand and manage own and others' emotions affecting relationships", "Innate only", "Not teachable"], correct: 1 },
        { id: 6, question: "How do emotions affect cognition?", options: ["No effect", "Emotions influence attention, memory, decision-making (mood-congruent effects)", "Independent", "Not related"], correct: 1 },
        { id: 7, question: "What are display rules and cultural differences?", options: ["No differences", "Cultural norms for emotional expression vary; affect communication, relationships", "Universal", "Not important"], correct: 1 }
      ],
      // Psychology Lesson 77: Stress & Personality
      "Stress & Personality": [
        { id: 1, question: "What is stress and how does body respond?", options: ["No response", "Alarm-resistance-exhaustion; fight-flight-freeze response; affects health", "Only mental", "No impact"], correct: 1 },
        { id: 2, question: "What are coping strategies and their effectiveness?", options: ["No difference", "Problem-focused vs. emotion-focused; some adaptive, some maladaptive", "All ineffective", "Not needed"], correct: 1 },
        { id: 3, question: "What is burnout and what causes it?", options: ["Not real", "Chronic workplace stress causing exhaustion, cynicism, reduced effectiveness", "Normal", "No causes"], correct: 1 },
        { id: 4, question: "What are personality theories?", options: ["Too many", "Psychoanalytic, humanistic, behavioral, trait (Big Five), genetic perspectives", "One correct", "Not studied"], correct: 1 },
        { id: 5, question: "What is the Big Five personality model?", options: ["Not useful", "Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism; stable traits", "Too simplistic", "Unchanging"], correct: 1 },
        { id: 6, question: "How stable is personality across time and situations?", options: ["Completely", "Moderately stable with situation influence; some change across lifespan", "Always changing", "Irrelevant"], correct: 1 },
        { id: 7, question: "What is the self-concept and how does it develop?", options: ["Fixed", "Mental image of oneself; develops through reflection, feedback, comparison", "Genetic", "Unchangeable"], correct: 1 }
      ],
      // Psychology Lesson 78: Disorders & Treatment Part 1
      "Disorders & Treatment Part 1": [
        { id: 1, question: "What defines psychological disorders?", options: ["Just sadness", "Maladaptive, distressing, deviant from norms affecting functioning", "Minor problems", "No criteria"], correct: 1 },
        { id: 2, question: "What are anxiety disorders?", options: ["Just worry", "Excessive fear/anxiety (generalized, social, panic, phobias) causing distress", "Normal", "Not disorders"], correct: 1 },
        { id: 3, question: "What is OCD and how does it differ from anxiety?", options: ["Same", "Obsessions + compulsions; focused repetitive behaviors to manage anxiety", "Just perfectionism", "Not real"], correct: 1 },
        { id: 4, question: "What are depressive disorders?", options: ["Just sadness", "Persistent low mood, anhedonia, cognitive/physical changes affecting daily function", "Temporary", "Not disorders"], correct: 1 },
        { id: 5, question: "What is bipolar disorder?", options: ["Just mood swings", "Alternating episodes of depression and mania/hypomania with impaired functioning", "Exaggeration", "Not real"], correct: 1 },
        { id: 6, question: "What causes psychological disorders?", options: ["One cause", "Biological, psychological, social factors interact; diathesis-stress model", "Only genetic", "No causes"], correct: 1 },
        { id: 7, question: "What are trauma and PTSD?", options: ["Not serious", "Response to frightening events with intrusive memories, avoidance, hyperarousal", "Weakness", "Not real"], correct: 1 }
      ],
      // Psychology Lesson 79: Disorders & Treatment Part 2
      "Disorders & Treatment Part 2": [
        { id: 1, question: "What is schizophrenia?", options: ["Split personality", "Psychotic disorder with delusions, hallucinations, disorganized thought/speech", "Personality disorder", "Not real"], correct: 1 },
        { id: 2, question: "What are eating disorders?", options: ["Just dieting", "Anorexia, bulimia, binge-eating with severe body image/eating disturbances", "Not serious", "Vanity"], correct: 1 },
        { id: 3, question: "What is personality disorder?", options: ["Just traits", "Pervasive inflexible patterns of thinking/behaving causing impairment or distress", "Minor issue", "Not real"], correct: 1 },
        { id: 4, question: "What is psychotherapy?", options: ["Just talking", "Psychological treatment using talking to modify thoughts, emotions, behaviors", "No evidence", "Not helpful"], correct: 1 },
        { id: 5, question: "What are therapy approaches?", options: ["All same", "Cognitive-behavioral, psychoanalytic, humanistic, family; different techniques", "No differences", "One best"], correct: 1 },
        { id: 6, question: "How do medications treat psychological disorders?", options: ["No effect", "Antidepressants, anxiolytics, antipsychotics modify neurotransmitter function", "Placebos", "Harmful"], correct: 1 },
        { id: 7, question: "What is the effectiveness of treatment?", options: ["Not helpful", "Therapy and medication reduce symptoms, improve functioning; often combined", "No change", "Always fails"], correct: 1 }
      ],
      // Psychology Lesson 80: Social Psychology & Influence
      "Social Psychology & Influence": [
        { id: 1, question: "What is social influence?", options: ["Not real", "Pressure to conform affecting thoughts/behavior (conformity, compliance, obedience)", "Individual only", "No effect"], correct: 1 },
        { id: 2, question: "What are group effects on behavior?", options: ["No effect", "Social facilitation, social loafing, groupthink, polarization in groups", "Always positive", "No change"], correct: 1 },
        { id: 3, question: "What is prejudice and how does it form?", options: ["Not real", "Negative attitude based on group membership; from stereotypes, categorization, conflict", "Factual", "Justified"], correct: 1 },
        { id: 4, question: "What is discrimination and its effects?", options: ["Not harmful", "Prejudice in action; affects opportunities, health, well-being of targeted groups", "Beneficial", "No impact"], correct: 1 },
        { id: 5, question: "What is attribution theory?", options: ["Not important", "How we explain behavior: internal vs. external; fundamental attribution error", "No patterns", "Accurate"], correct: 1 },
        { id: 6, question: "What is attraction and what factors influence it?", options: ["Random", "Proximity, similarity, physical attractiveness, reciprocity affect relationship formation", "No factors", "Unchanging"], correct: 1 },
        { id: 7, question: "What are prosocial behavior and altruism?", options: ["Not real", "Helping others without expectation; influenced by empathy, situational factors", "Always selfish", "No helping"], correct: 1 }
      ],
    };

    // Fallback for any lesson not in the map
    if (!worksheetMap[lessonTitle]) {
      return Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        question: `Question ${i + 1} about "${lessonTitle}"`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0
      }));
    }

    return worksheetMap[lessonTitle];
  };

  const worksheet1Questions = createDetailedWorksheets(lessonVideos, currentLesson?.title || "");
  
  // Worksheet 2 with different questions on the same lesson
  const createSecondWorksheet = (videos, lessonTitle) => {
    const secondSheetMap = {
      "Introduction to Biology": [
        { id: 1, question: "How many levels of biological organization are there, from simplest to most complex?", options: ["3", "4", "Many levels from atoms to organisms", "Just two"], correct: 2 },
        { id: 2, question: "What is an adaptation?", options: ["A disease", "A trait that helps an organism survive and reproduce in its environment", "A behavior change only", "A temporary change"], correct: 1 },
        { id: 3, question: "Do unicellular organisms have the same basic structures as multicellular organisms?", options: ["Always", "Prokaryotes lack membrane-bound organelles while eukaryotes have them", "Never", "Only in certain environments"], correct: 1 },
        { id: 4, question: "What is microevolution?", options: ["Not real", "Small genetic changes in a population over short time periods", "Large extinction events", "Individual growth"], correct: 1 },
        { id: 5, question: "What is a control group in an experiment?", options: ["The largest group", "The group without the variable being tested, used for comparison", "Same as experimental group", "Not necessary"], correct: 1 },
        { id: 6, question: "What defines life more specifically than any other characteristic?", options: ["Movement", "The ability to use energy, reproduce, and adapt to the environment", "Size", "Color"], correct: 1 },
        { id: 7, question: "How is biodiversity measured and why is it important?", options: ["Only by counting animals", "By measuring species variety, genetic diversity, and ecosystem types; supports resilience and stability", "Not measurable", "Not important to study"], correct: 1 }
      ],
      "Ecology": [
        { id: 1, question: "What is ecological succession and what are the two types?", options: ["No such thing", "Sequential change in communities; primary on bare rock, secondary in disturbed areas", "Only happens once", "Not observable"], correct: 1 },
        { id: 2, question: "What are pioneer species and why are they significant?", options: ["Advanced organisms", "First species to colonize new environments, beginning succession", "Most complex organisms", "Found only in cities"], correct: 1 },
        { id: 3, question: "What is a niche versus a habitat?", options: ["Same thing", "Habitat is where an organism lives; niche is its specific role and how it survives", "Niche is larger", "Not different"], correct: 1 },
        { id: 4, question: "How do nutrient cycles work in ecosystems?", options: ["Linear from organism to environment", "Circular cycling of elements through biotic and abiotic components", "One way flow only", "Not cyclical"], correct: 1 },
        { id: 5, question: "What determines the structure of an ecosystem?", options: ["Only sunlight", "Abiotic factors (climate, soil) and biotic factors (species interactions)", "Just water availability", "Random factors"], correct: 1 },
        { id: 6, question: "What is the greenhouse effect and how does it function?", options: ["Only natural", "Atmospheric gases trap heat, preventing radiation escape; enhanced by human emissions", "Doesn't affect Earth", "Only beneficial"], correct: 1 },
        { id: 7, question: "How can individuals reduce their environmental impact?", options: ["Impossible", "Through energy conservation, sustainable choices, and supporting conservation efforts", "Only large groups matter", "Cannot make a difference"], correct: 1 }
      ],
      "Evolution": [
        { id: 1, question: "What is the difference between evolution and natural selection?", options: ["No difference", "Evolution is change in populations; natural selection is the mechanism driving it", "Evolution is false", "Same concept"], correct: 1 },
        { id: 2, question: "What is genetic drift?", options: ["Directed change", "Random changes in allele frequency, especially in small populations", "Always increases fitness", "Only in large populations"], correct: 1 },
        { id: 3, question: "What is homologous structures and what do they suggest?", options: ["Identical structures", "Similar structures from common ancestors, suggesting evolutionary relationship", "Not evidence of evolution", "Found in unrelated species"], correct: 1 },
        { id: 4, question: "What is the difference between convergent and divergent evolution?", options: ["No difference", "Convergent: different origins, similar traits; Divergent: common origin, different traits", "They're the same", "Not observable"], correct: 1 },
        { id: 5, question: "How does the fossil record demonstrate evolution?", options: ["It doesn't", "Shows progression of life forms, transitions between species, and extinctions over time", "Only shows current species", "Contradicts evolution"], correct: 1 },
        { id: 6, question: "What is the role of isolation in speciation?", options: ["Prevents speciation", "Geographic or reproductive isolation allows populations to diverge genetically into separate species", "Reduces variation", "Not important"], correct: 1 },
        { id: 7, question: "How are molecular comparisons used to understand evolution?", options: ["Not used", "DNA and protein similarity indicates evolutionary relationships and common ancestry", "Only for living organisms", "Less reliable than fossils"], correct: 1 }
      ],
      "Evolutionary History": [
        { id: 1, question: "What is radiometric dating and why is it important for studying fossils?", options: ["Guessing", "Using radioactive decay to determine age of rocks and fossils", "Not accurate", "Only for young fossils"], correct: 1 },
        { id: 2, question: "What are the major divisions of the tree of life?", options: ["Only animals", "Three domains: Bacteria, Archaea, and Eukarya", "Just plants and animals", "No divisions exist"], correct: 1 },
        { id: 3, question: "How is carbon used in all living organisms?", options: ["It's not", "Carbon is the backbone of all biological molecules (proteins, DNA, carbohydrates)", "Only in animals", "Only in plants"], correct: 1 },
        { id: 4, question: "What is the central dogma of molecular biology?", options: ["Not important", "DNA → RNA → Protein; the flow of genetic information", "Protein → RNA → DNA", "No such concept"], correct: 1 },
        { id: 5, question: "What do mutations provide for evolution?", options: ["Nothing helpful", "Genetic variation that natural selection acts upon", "Always harmful", "Not important"], correct: 1 },
        { id: 6, question: "How has Earth's atmosphere changed since the origin of life?", options: ["No changes", "Early atmosphere had no oxygen; oxygen increased due to photosynthesis", "Always had oxygen", "Currently decreasing"], correct: 1 },
        { id: 7, question: "What evidence suggests all organisms are related?", options: ["No evidence", "Universal genetic code, similar cellular structures, and DNA in all organisms", "Each organism is unique", "Impossible"], correct: 1 }
      ],
      "Cell Structure": [
        { id: 1, question: "What is the primary component of the cell membrane?", options: ["Protein only", "A phospholipid bilayer with embedded and peripheral proteins", "Just lipids", "DNA"], correct: 1 },
        { id: 2, question: "What is the function of the endoplasmic reticulum?", options: ["Energy production", "Synthesis and transport of proteins and lipids throughout the cell", "Breaking down waste", "DNA storage"], correct: 1 },
        { id: 3, question: "What is the Golgi apparatus and what does it do?", options: ["Produces energy", "Packages and ships proteins and lipids from ER to their destinations", "Breaks down waste", "Stores DNA"], correct: 1 },
        { id: 4, question: "What is the function of lysosomes?", options: ["Storing nutrients", "Breaking down and digesting cellular waste and pathogens", "Protein synthesis", "Energy production"], correct: 1 },
        { id: 5, question: "What is osmosis and how does it affect cells?", options: ["Any water movement", "Movement of water across membranes from low to high solute concentration", "Not important", "Only in plants"], correct: 1 },
        { id: 6, question: "What is the difference between prokaryotic and eukaryotic cell division?", options: ["No difference", "Prokaryotes use binary fission; eukaryotes use mitosis or meiosis", "All the same", "Both are identical"], correct: 1 },
        { id: 7, question: "Why is surface area to volume ratio important for cells?", options: ["Not important", "Determines how efficiently cells can exchange materials with environment", "Only in large cells", "Doesn't matter"], correct: 1 }
      ],
      "Cell Division & Energy": [
        { id: 1, question: "What is the equation for photosynthesis?", options: ["CO2 + Water → Glucose + Oxygen", "6CO2 + 6H2O + Light → C6H12O6 + 6O2", "Only sunlight needed", "No specific equation"], correct: 1 },
        { id: 2, question: "What is the equation for cellular respiration?", options: ["Glucose alone → Energy", "C6H12O6 + 6O2 → 6CO2 + 6H2O + ATP energy", "No equation exists", "Same as photosynthesis"], correct: 1 },
        { id: 3, question: "What are the main stages of cellular respiration?", options: ["Just one stage", "Glycolysis, Krebs cycle, and electron transport chain", "Only in mitochondria", "In the nucleus"], correct: 1 },
        { id: 4, question: "What happens during prophase of mitosis?", options: ["Cells separate", "Chromosomes condense and spindle fibers begin to form", "Chromosomes align", "Cytokinesis"], correct: 1 },
        { id: 5, question: "What is the purpose of checkpoints in the cell cycle?", options: ["To stop division", "To ensure DNA is properly replicated and cells are ready for division", "Not important", "To speed up division"], correct: 1 },
        { id: 6, question: "How does cancer relate to the cell cycle?", options: ["No relation", "Cancer occurs when cell cycle checkpoints fail, allowing uncontrolled division", "Cancer is beneficial", "Doesn't affect cells"], correct: 1 },
        { id: 7, question: "What is the difference between binary fission and mitosis?", options: ["No difference", "Binary fission is asexual prokaryotic division; mitosis is eukaryotic division", "Both are identical", "Only in bacteria"], correct: 1 }
      ],
      "Genetics Basics": [
        { id: 1, question: "What is the genotype versus phenotype?", options: ["Same thing", "Genotype is genetic makeup; phenotype is expressed traits", "Phenotype is hereditary", "No difference"], correct: 1 },
        { id: 2, question: "What is Mendel's law of segregation?", options: ["Genes never separate", "Allele pairs separate during gamete formation, one to each gamete", "Applies only to plants", "No such law"], correct: 1 },
        { id: 3, question: "What is the difference between homozygous and heterozygous?", options: ["No difference", "Homozygous has two identical alleles; heterozygous has two different alleles", "Both are the same", "Only in males"], correct: 1 },
        { id: 4, question: "What is complementary base pairing in DNA?", options: ["Any bases pair randomly", "Adenine pairs with thymine, guanine pairs with cytosine", "Not important", "Bases don't pair"], correct: 1 },
        { id: 5, question: "What is the role of mRNA in protein synthesis?", options: ["Stores energy", "Carries genetic information from DNA to ribosomes for protein translation", "Breaks down proteins", "Provides structure"], correct: 1 },
        { id: 6, question: "What is a codon and how many amino acids does it code for?", options: ["Codes for multiple acids", "A three-base sequence that codes for one amino acid", "Not important", "Varies by codon"], correct: 1 },
        { id: 7, question: "How are genetic traits inherited in humans?", options: ["Randomly only", "Through dominant and recessive alleles from both parents determining phenotype", "Only from mother", "Not inherited"], correct: 1 }
      ],
      "Gene Expression": [
        { id: 1, question: "What causes genetic mutations and what are some examples?", options: ["Nothing causes them", "UV radiation, chemicals, copying errors; include point mutations, deletions, insertions", "Never occur", "Only beneficial"], correct: 1 },
        { id: 2, question: "What is the difference between DNA and RNA?", options: ["No difference", "DNA has deoxyribose sugar and thymine; RNA has ribose and uracil", "They're identical", "Only structural difference"], correct: 1 },
        { id: 3, question: "How do viruses reproduce and affect host cells?", options: ["They can't reproduce", "They inject genetic material, hijacking cell machinery to produce copies", "No effect on cells", "Always beneficial"], correct: 1 },
        { id: 4, question: "What is genetic engineering used for?", options: ["Nothing useful", "Creating organisms with desired traits for medicine, agriculture, and research", "Always dangerous", "Not possible"], correct: 1 },
        { id: 5, question: "What is an epigenetic change?", options: ["A genetic mutation", "Changes in gene expression without altering DNA sequence, influenced by environment", "Inheritable permanently", "Not reversible"], correct: 1 },
        { id: 6, question: "How do antibiotics work against bacteria?", options: ["They don't work", "By targeting bacterial structures or processes without harming human cells", "They cure viruses", "Harmful to humans"], correct: 1 },
        { id: 7, question: "What makes mRNA vaccines effective for viral diseases?", options: ["They don't work", "They instruct cells to make viral proteins that trigger immune response without infection", "They contain live virus", "No mechanism of action"], correct: 1 }
      ],
      "Multicellular Organisms": [
        { id: 1, question: "What is an organ system and what is an example?", options: ["Just organs", "Multiple organs working together for a function, like the respiratory system", "Not important", "Doesn't exist"], correct: 1 },
        { id: 2, question: "What is the difference between xylem and phloem in plants?", options: ["Same thing", "Xylem transports water upward; phloem transports sugars throughout the plant", "Opposite in function", "Not different"], correct: 1 },
        { id: 3, question: "What is the function of the respiratory system?", options: ["Digestion", "Gas exchange: delivering oxygen to cells and removing carbon dioxide", "Circulation only", "Waste storage"], correct: 1 },
        { id: 4, question: "How does the nervous system coordinate body responses?", options: ["It doesn't", "Through electrical and chemical signals allowing rapid communication between brain, nerves, and body", "Only for sensation", "Only in animals"], correct: 1 },
        { id: 5, question: "What is tissue engineering?", options: ["Not real", "Creating functional tissues or organs from cells for medical use and research", "Only theoretical", "Impossible"], correct: 1 },
        { id: 6, question: "What are meristems in plants?", options: ["Leaves only", "Growth tissues where cells divide and specialize, enabling plant growth", "Flowers", "Roots only"], correct: 1 },
        { id: 7, question: "How do multicellular organisms maintain internal stability (homeostasis)?", options: ["They don't", "Through coordinated regulation of organ systems responding to environmental changes", "No mechanisms exist", "Impossible"], correct: 1 }
      ],
      "Animal Systems & Behavior": [
        { id: 1, question: "What is the difference between the sympathetic and parasympathetic nervous systems?", options: ["No difference", "Sympathetic activates 'fight or flight'; parasympathetic activates 'rest and digest'", "They're the same", "Only one exists"], correct: 1 },
        { id: 2, question: "What are neurotransmitters and what is their role?", options: ["Nerve fibers", "Chemical messengers that transmit signals between neurons", "Only in brain", "Not important"], correct: 1 },
        { id: 3, question: "What is hormonal regulation and why is it important?", options: ["Not important", "Endocrine system uses hormones for slow but long-lasting regulation of bodily functions", "Only in plants", "Doesn't affect behavior"], correct: 1 },
        { id: 4, question: "What is the difference between an innate behavior and a learned behavior?", options: ["No difference", "Innate is instinctive; learned is acquired through experience and conditioning", "Same thing", "Only in humans"], correct: 1 },
        { id: 5, question: "What is ecological behavior and why is it important?", options: ["Not important", "Behaviors related to survival, reproduction, and interactions with environment", "Only in wild animals", "Doesn't matter"], correct: 1 },
        { id: 6, question: "How do different species communicate?", options: ["Only with sound", "Through visual displays, chemical signals (pheromones), sound, and touch", "All the same way", "Cannot communicate"], correct: 1 },
        { id: 7, question: "What is the relationship between genetics and behavior?", options: ["Not related", "Genes influence behavior potential; environment determines final expression", "Purely genetic", "Purely environmental"], correct: 1 }
      ],
      // Chemistry Lesson 11: The Foundations of Matter
      "The Foundations of Matter": [
        { id: 1, question: "What are the three subatomic particles and their charges?", options: ["All neutral", "Protons (positive), neutrons (neutral), electrons (negative)", "All negative", "All positive"], correct: 1 },
        { id: 2, question: "How does the periodic table predict element properties?", options: ["It doesn't", "Elements in the same group have similar electron configurations and properties", "All elements behave the same", "Unpredictable"], correct: 1 },
        { id: 3, question: "What is unit conversion and why is it essential?", options: ["Not necessary", "Converting between different measurement units ensuring consistency in calculations", "Only for large numbers", "Not used in practice"], correct: 1 },
        { id: 4, question: "How do you determine significant figures in measurements?", options: ["Random choice", "Count digits from first non-zero digit to last measured digit", "Always all digits", "Not important"], correct: 1 },
        { id: 5, question: "What is atomic mass?", options: ["Only protons", "Average mass of an atom including protons, neutrons, and electrons", "Same for all atoms", "Not measurable"], correct: 1 },
        { id: 6, question: "How does atomic number relate to the periodic table position?", options: ["Not related", "Atomic number determines position; elements are arranged by increasing atomic number", "Position is random", "Not relevant"], correct: 1 },
        { id: 7, question: "Why do elements in the same group behave similarly?", options: ["They don't", "They have the same number of valence electrons", "Atomic mass is similar", "No reason"], correct: 1 }
      ],
      // Chemistry Lesson 12: Chemical Math & Reactions
      "Chemical Math & Reactions": [
        { id: 1, question: "What does a balanced chemical equation represent?", options: ["Just formulas", "Conservation of mass with correct mole ratios of reactants and products", "No significance", "Random coefficients"], correct: 1 },
        { id: 2, question: "How is molarity calculated and used?", options: ["Not calculated", "Moles of solute per liter of solution; used to express concentration", "Same as molality", "Only theoretical"], correct: 1 },
        { id: 3, question: "What is the difference between strong and weak acids?", options: ["No difference", "Strong acids completely dissociate; weak acids partially dissociate", "Both fully dissociate", "Weak acids don't dissociate"], correct: 1 },
        { id: 4, question: "What causes a precipitate to form?", options: ["Random", "When ionic compound solubility is exceeded forming an insoluble solid", "All reactions form precipitates", "Never"], correct: 1 },
        { id: 5, question: "How are oxidation numbers assigned?", options: ["Randomly", "According to rules determining electron distribution in compounds", "Not important", "Only for metals"], correct: 1 },
        { id: 6, question: "What is the relationship between moles and particles?", options: ["Not related", "One mole contains Avogadro's number (6.02 × 10²³) of particles", "Variable", "No fixed relationship"], correct: 1 },
        { id: 7, question: "How do you predict reaction products?", options: ["Guess", "Use solubility rules and reaction type patterns to determine products", "Trial and error", "Cannot predict"], correct: 1 }
      ],
      // Chemistry Lesson 13: The Language of Gases
      "The Language of Gases": [
        { id: 1, question: "What does each variable in PV = nRT represent?", options: ["Not important", "P=pressure, V=volume, n=moles, R=constant, T=temperature", "Random variables", "Unclear"], correct: 1 },
        { id: 2, question: "How do gas laws like Boyle's, Charles's relate to ideal gas law?", options: ["Not related", "They are special cases of the ideal gas law for constant conditions", "Opposite relationships", "Contradictory"], correct: 1 },
        { id: 3, question: "What assumptions do ideal gases make that real gases violate?", options: ["None exist", "Ideal assumes no intermolecular forces; real gases have them", "No violations", "Always true"], correct: 1 },
        { id: 4, question: "How do you calculate mole fraction from partial pressures?", options: ["Cannot calculate", "Mole fraction = partial pressure / total pressure", "Need volumes", "Not possible"], correct: 1 },
        { id: 5, question: "Why do real gases deviate from ideal behavior?", options: ["They don't", "Molecular size and intermolecular forces become significant", "Always ideal", "Unknown reason"], correct: 1 },
        { id: 6, question: "What is the combined gas law?", options: ["Only for heating", "Combines Boyle's, Charles's, and Gay-Lussac's laws for variable conditions", "Not useful", "Never used"], correct: 1 },
        { id: 7, question: "How do you solve multi-step gas law problems?", options: ["Randomly", "Identify known/unknown variables, select appropriate equation, solve systematically", "By intuition", "Impossible"], correct: 1 }
      ],
      // Chemistry Lesson 14: Energy & Thermodynamics
      "Energy & Thermodynamics": [
        { id: 1, question: "What is the difference between heat and temperature?", options: ["Same thing", "Heat is energy transfer; temperature is measure of molecular motion", "Opposite", "Not related"], correct: 1 },
        { id: 2, question: "How do you calculate heat using q = mc∆T?", options: ["Cannot calculate", "q = mass × specific heat × temperature change", "Only for liquids", "Not practical"], correct: 1 },
        { id: 3, question: "What is Hess's Law?", options: ["Not applicable", "Enthalpy change is the same regardless of reaction pathway", "Path matters", "Not proven"], correct: 1 },
        { id: 4, question: "What indicates a spontaneous reaction?", options: ["Requires energy", "Negative Gibbs free energy (∆G < 0)", "Always endothermic", "No indicators"], correct: 1 },
        { id: 5, question: "How does entropy affect reaction spontaneity?", options: ["No effect", "Increases in system entropy favor spontaneous reactions", "Always inhibits", "Unpredictable"], correct: 1 },
        { id: 6, question: "What is the difference between kinetics and thermodynamics?", options: ["No difference", "Thermodynamics tells if reaction occurs; kinetics tells how fast", "Same thing", "Unrelated"], correct: 1 },
        { id: 7, question: "Why can exothermic reactions be non-spontaneous?", options: ["Cannot be", "Entropy decrease or ∆S negative can overcome ∆H negative", "Always spontaneous", "Not possible"], correct: 1 }
      ],
      // Chemistry Lesson 15: Bonding & Molecular Structure
      "Bonding & Molecular Structure": [
        { id: 1, question: "How do you determine if a bond is ionic or covalent?", options: ["No method", "Compare electronegativities; large difference suggests ionic", "All same type", "Random"], correct: 1 },
        { id: 2, question: "What is VSEPR theory used for?", options: ["Bonding only", "Predicting 3D molecular geometry based on electron pair repulsion", "Not useful", "Theoretical only"], correct: 1 },
        { id: 3, question: "What is hybridization?", options: ["Not real", "Mixing of atomic orbitals to form hybrid orbitals for bonding", "Only in metals", "No evidence"], correct: 1 },
        { id: 4, question: "How do bond strength and bond length relate?", options: ["Not related", "Stronger bonds are generally shorter", "Opposite", "No pattern"], correct: 1 },
        { id: 5, question: "What determines molecular polarity?", options: ["Not determined", "Geometry and electronegativity differences of bonds", "Only bond types", "Symmetry only"], correct: 1 },
        { id: 6, question: "What are resonance structures?", options: ["Not real", "Multiple Lewis structures representing the actual bonding in a molecule", "Single possibility", "Unstable"], correct: 1 },
        { id: 7, question: "How does molecular structure affect chemical properties?", options: ["No effect", "Structure determines reactivity, polarity, and physical properties", "Not important", "Unrelated"], correct: 1 }
      ],
      // Chemistry Lesson 16: Phases of Matter
      "Phases of Matter": [
        { id: 1, question: "What intermolecular forces exist between molecules?", options: ["No forces", "Dipole-dipole, London dispersion, hydrogen bonding, ionic", "Only covalent", "Not relevant"], correct: 1 },
        { id: 2, question: "How do intermolecular forces affect physical properties?", options: ["No effect", "Determine melting point, boiling point, and solubility", "Only for solids", "Not significant"], correct: 1 },
        { id: 3, question: "What is the difference between saturated and unsaturated solutions?", options: ["No difference", "Saturated contains max dissolved solute; unsaturated can dissolve more", "Same concentration", "Not important"], correct: 1 },
        { id: 4, question: "How do you shift equilibrium position?", options: ["Cannot shift", "Change pressure, temperature, or concentration per Le Chatelier's Principle", "Impossible", "Equilibrium fixed"], correct: 1 },
        { id: 5, question: "What is Kp and how does it differ from Kc?", options: ["No difference", "Kp uses partial pressures; Kc uses molar concentrations", "Same value", "Not related"], correct: 1 },
        { id: 6, question: "How do you calculate Q and use it to predict equilibrium direction?", options: ["Cannot calculate", "Calculate Q, compare to K to determine if reaction shifts left or right", "Not useful", "Q equals K"], correct: 1 },
        { id: 7, question: "What is the common ion effect?", options: ["Not real", "Shift in equilibrium caused by introduction of an ion already in equilibrium", "Increases solubility", "No effect"], correct: 1 }
      ],
      // Chemistry Lesson 17: Acids, Bases, & Kinetics
      "Acids, Bases, & Kinetics": [
        { id: 1, question: "What is the relationship between pH and pOH?", options: ["Not related", "pH + pOH = 14 at 25°C", "Same value", "Opposite always"], correct: 1 },
        { id: 2, question: "How do you calculate pH from [H+] concentration?", options: ["Cannot calculate", "pH = -log[H+]", "Not useful", "pH equals [H+]"], correct: 1 },
        { id: 3, question: "What is the Henderson-Hasselbalch equation used for?", options: ["Not practical", "Calculating pH of buffer solutions", "Only for acids", "Theoretical only"], correct: 1 },
        { id: 4, question: "What factors affect reaction rate?", options: ["Reaction is fixed", "Temperature, concentration, surface area, and catalysts", "Only temperature", "Not controllable"], correct: 1 },
        { id: 5, question: "What is the rate law and how is order determined?", options: ["Not important", "Equation relating rate to reactant concentrations; order determined experimentally", "Same for all reactions", "Theory only"], correct: 1 },
        { id: 6, question: "How do catalysts work without being consumed?", options: ["They are consumed", "Provide alternative pathway lowering activation energy", "Slow reactions", "Not understood"], correct: 1 },
        { id: 7, question: "What is the relationship between activation energy and rate?", options: ["Not related", "Lower activation energy means faster reaction rate", "No effect", "Opposite"], correct: 1 }
      ],
      // Chemistry Lesson 18: Advanced Atomic Theory & Electricity
      "Advanced Atomic Theory & Electricity": [
        { id: 1, question: "How do you identify oxidation states in compounds?", options: ["Random assignment", "Follow oxidation number rules systematically", "No method", "Guess"], correct: 1 },
        { id: 2, question: "What is a half-reaction and why split reactions?", options: ["Not used", "Shows electron transfer for one species; helps balance redox equations", "Not helpful", "Complicated"], correct: 1 },
        { id: 3, question: "What are galvanic and electrolytic cells?", options: ["Same thing", "Galvanic produces electricity from reactions; electrolytic uses electricity", "Not different", "No practical use"], correct: 1 },
        { id: 4, question: "What is cell potential and how is it calculated?", options: ["Not measurable", "E°cell = E°cathode - E°anode; indicates spontaneity", "Random", "Not useful"], correct: 1 },
        { id: 5, question: "How do periodic trends like ionization energy vary?", options: ["No patterns", "Increase across period, decrease down group", "Random", "Unpredictable"], correct: 1 },
        { id: 6, question: "What is electron affinity and how does it compare to ionization energy?", options: ["Same thing", "Electron affinity is energy to gain electron; ionization is to remove electron", "Not related", "No difference"], correct: 1 },
        { id: 7, question: "Why do transition metals have variable oxidation states?", options: ["They don't", "d electrons can be removed with similar energy allowing multiple states", "Always +2", "No explanation"], correct: 1 }
      ],
      // Chemistry Lesson 19: Nuclear Chemistry & Organic Intro
      "Nuclear Chemistry & Organic Intro": [
        { id: 1, question: "What are the types of radioactive decay?", options: ["Unknown", "Alpha, beta, and gamma emissions from unstable nuclei", "Only one type", "Not categorized"], correct: 1 },
        { id: 2, question: "What is the half-life and how is it used?", options: ["Not useful", "Time for half of sample to decay; used to date objects", "Total decay time", "Not practical"], correct: 1 },
        { id: 3, question: "What is the difference between alkanes, alkenes, and alkynes?", options: ["No difference", "Alkanes single bonds, alkenes double bonds, alkynes triple bonds", "All same", "Not distinct"], correct: 1 },
        { id: 4, question: "How are organic compounds named systematically?", options: ["Random names", "IUPAC nomenclature using parent chain, prefixes, and locants", "Not standardized", "Arbitrary"], correct: 1 },
        { id: 5, question: "What is isomerism in organic chemistry?", options: ["Not real", "Different compounds with same molecular formula", "All compounds unique", "Impossible"], correct: 1 },
        { id: 6, question: "What are functional groups and their importance?", options: ["Just decorations", "Groups defining reactivity of organic compounds", "Not significant", "Unclear role"], correct: 1 },
        { id: 7, question: "Why is carbon's bonding versatility important?", options: ["Not important", "Allows formation of vast variety of organic molecules with different properties", "Limited value", "Only theoretical"], correct: 1 }
      ],
      // Chemistry Lesson 20: Organic Chemistry & Global Cycles
      "Organic Chemistry & Global Cycles": [
        { id: 1, question: "What are the major functional groups in organic chemistry?", options: ["Not important", "Alcohols, aldehydes, ketones, carboxylic acids, esters, amines, etc.", "Only hydrocarbons", "Not many"], correct: 1 },
        { id: 2, question: "How do you predict organic reaction products?", options: ["Impossible", "Use reaction mechanisms and functional group behavior", "Random", "No patterns"], correct: 1 },
        { id: 3, question: "What is a polymer and what are examples?", options: ["Rare", "Large molecules from monomers; plastics, proteins, DNA", "Only synthetic", "Not useful"], correct: 1 },
        { id: 4, question: "How does the carbon cycle involve chemistry?", options: ["Not related", "CO2 conversion and fixation through photosynthesis and respiration", "Only biology", "Not chemical"], correct: 1 },
        { id: 5, question: "What is combustion of hydrocarbons?", options: ["Not common", "Reaction with oxygen producing CO2, H2O, and heat energy", "Always endothermic", "No products"], correct: 1 },
        { id: 6, question: "How are polymers synthesized?", options: ["Not understood", "Through polymerization reactions linking monomers", "Only naturally", "Theoretical"], correct: 1 },
        { id: 7, question: "Why is organic chemistry central to all life?", options: ["Not important", "Organic molecules (proteins, nucleic acids, lipids) form all living things", "Not really central", "Overstatement"], correct: 1 }
      ],
      // Physics Lesson 21 Worksheet 2: One-Dimensional Motion & Calculus
      "One-Dimensional Motion & Calculus": [
        { id: 1, question: "How is instantaneous velocity different from average velocity?", options: ["No difference", "Average is displacement over total time; instantaneous is velocity at one moment", "They're the same", "Only instantaneous is used"], correct: 1 },
        { id: 2, question: "What is the kinematic equation for position?", options: ["Not useful", "x = x₀ + v₀t + ½at²", "Only for constant velocity", "No such equation"], correct: 1 },
        { id: 3, question: "How does integration relate to motion?", options: ["Not used", "Integration finds position from velocity, and velocity from acceleration", "Opposite of derivatives", "Not applicable"], correct: 1 },
        { id: 4, question: "What is the relationship between velocity and position graphically?", options: ["No relationship", "Slope of position-time graph equals velocity", "Parallel lines", "Independent"], correct: 1 },
        { id: 5, question: "How do you find distance traveled versus displacement?", options: ["Same thing", "Distance sums all path lengths; displacement is straight-line vector", "Always equal", "Not different"], correct: 1 },
        { id: 6, question: "What does a position-time graph tell you about motion?", options: ["Nothing", "Slope shows velocity; curvature shows acceleration", "Only speed", "Only direction"], correct: 1 },
        { id: 7, question: "How are velocity-time graphs useful in kinematics?", options: ["Not useful", "Area under curve shows displacement; slope shows acceleration", "Only for visualization", "No quantitative info"], correct: 1 }
      ],
      // Physics Lesson 22 Worksheet 2: Forces, Friction & Circular Motion
      "Forces, Friction & Circular Motion": [
        { id: 1, question: "What is the coefficient of friction and what does it represent?", options: ["Not important", "Dimensionless ratio describing roughness between surfaces", "Always the same", "Doesn't vary"], correct: 1 },
        { id: 2, question: "How is static friction different from kinetic friction quantitatively?", options: ["Same", "Static is usually larger; both related to normal force by coefficient", "Kinetic is stronger", "No difference"], correct: 1 },
        { id: 3, question: "What provides the centripetal force in planetary motion?", options: ["Thrust", "Gravitational force between planet and sun", "Friction", "Electromagnetic"], correct: 1 },
        { id: 4, question: "How does normal force relate to friction force?", options: ["No relation", "Friction force proportional to normal force (f = μN)", "Independent", "Inverse"], correct: 1 },
        { id: 5, question: "What is the relationship between speed and centripetal acceleration in circular motion?", options: ["Linear", "Quadratic (a = v²/r; doubling speed quadruples acceleration)", "Inverse", "No relationship"], correct: 1 },
        { id: 6, question: "How does banking of curves reduce friction needed?", options: ["Increases friction", "Normal force component provides centripetal force, reducing reliance on friction", "No effect", "Increases danger"], correct: 1 },
        { id: 7, question: "What is the difference between tangential and centripetal acceleration?", options: ["Same", "Tangential changes speed (along path); centripetal changes direction (toward center)", "Always equal", "Not related"], correct: 1 }
      ],
      // Physics Lesson 23 Worksheet 2: Momentum & Rotational Mechanics
      "Momentum & Rotational Mechanics": [
        { id: 1, question: "How does impulse relate to momentum change?", options: ["Not related", "Impulse (F·Δt) equals change in momentum (Δp)", "Opposite", "Independent"], correct: 1 },
        { id: 2, question: "What is the center of mass and why is it important?", options: ["Not important", "Point where all mass can be considered concentrated; simplifies analysis", "Not useful", "Fictional concept"], correct: 1 },
        { id: 3, question: "How does moment of inertia affect rotational kinetic energy?", options: ["No effect", "Rotational KE = ½Iω²; larger I means more energy needed", "Reduces energy", "Not related"], correct: 1 },
        { id: 4, question: "What is the parallel axis theorem?", options: ["Not applicable", "I_parallel = I_cm + Md²; relates moment of inertia through different axes", "Doesn't work", "Only theory"], correct: 1 },
        { id: 5, question: "How is angular momentum conserved in collisions?", options: ["Never", "No external torque in closed system, so total angular momentum is conserved", "Only sometimes", "Can't be"], correct: 1 },
        { id: 6, question: "What is the difference between static and dynamic equilibrium?", options: ["No difference", "Static: at rest; dynamic: moving at constant velocity; both have net force = 0", "Same thing", "No distinction"], correct: 1 },
        { id: 7, question: "How do you calculate work done in rotational motion?", options: ["Can't calculate", "Work = torque × angle (W = τθ)", "Same as linear", "Not applicable"], correct: 1 }
      ],
      // Physics Lesson 24 Worksheet 2: Fluids & Oscillations
      "Fluids & Oscillations": [
        { id: 1, question: "How does pressure vary with depth in a fluid?", options: ["Stays constant", "Increases linearly with depth (P = P₀ + ρgh)", "Decreases", "Not predictable"], correct: 1 },
        { id: 2, question: "What is continuity equation in fluid dynamics?", options: ["Not real", "Conservation of mass: A₁v₁ = A₂v₂; flow rate is constant", "Only approximation", "Disproven"], correct: 1 },
        { id: 3, question: "What is Bernoulli's Equation?", options: ["Not important", "P + ½ρv² + ρgh = constant; relates pressure, velocity, and height in flowing fluids", "Only theory", "Never applies"], correct: 1 },
        { id: 4, question: "What is the period of a simple harmonic oscillator?", options: ["Random", "T = 2π√(m/k); depends on mass and spring constant", "Always 1 second", "No pattern"], correct: 1 },
        { id: 5, question: "What is the difference between transverse and longitudinal waves?", options: ["No difference", "Transverse: oscillates perpendicular; longitudinal: parallel to direction of travel", "Same", "Only one type exists"], correct: 1 },
        { id: 6, question: "What is the wave equation and what does it describe?", options: ["Not useful", "v = fλ; relates wave speed, frequency, and wavelength", "Only for sound", "Theoretical"], correct: 1 },
        { id: 7, question: "How does resonance occur in oscillating systems?", options: ["Doesn't happen", "Driving frequency matches natural frequency, causing maximum amplitude", "Reduces amplitude", "Rarely occurs"], correct: 1 }
      ],
      // Physics Lesson 25 Worksheet 2: Sound & Thermal Physics
      "Sound & Thermal Physics": [
        { id: 1, question: "What is the relationship between wavelength, frequency, and speed of sound?", options: ["No relationship", "v = fλ; speed equals frequency times wavelength", "Independent", "Not connected"], correct: 1 },
        { id: 2, question: "How does the medium affect sound propagation?", options: ["Not affected", "Sound travels faster in denser media (solids > liquids > gases)", "All the same", "Medium irrelevant"], correct: 1 },
        { id: 3, question: "What is decibel scale and how is it calculated?", options: ["Linear scale", "Logarithmic scale: dB = 10 log(I/I₀)", "Only for music", "Not used"], correct: 1 },
        { id: 4, question: "How is heat different from temperature?", options: ["Same thing", "Temperature measures molecular KE; heat is energy transfer due to temperature difference", "Identical", "No distinction"], correct: 1 },
        { id: 5, question: "What is specific heat capacity and its significance?", options: ["No importance", "Energy needed per unit mass per degree temperature change; different for each material", "Always the same", "Theoretical"], correct: 1 },
        { id: 6, question: "What is sublimation and deposition?", options: ["Not real", "Sublimation: solid→gas; deposition: gas→solid, bypassing liquid phase", "Same process", "Only theoretical"], correct: 1 },
        { id: 7, question: "How is thermal energy distributed among molecular degrees of freedom?", options: ["Randomly", "Equipartition theorem: each degree contributes ½kT to average energy", "All the same", "Not distributed"], correct: 1 }
      ],
      // Physics Lesson 26 Worksheet 2: Thermodynamics & Electrostatics
      "Thermodynamics & Electrostatics": [
        { id: 1, question: "What is the Second Law of Thermodynamics?", options: ["Energy conserved only", "Entropy of isolated system always increases; heat cannot spontaneously flow from cold to hot", "Disorder decreases", "Never true"], correct: 1 },
        { id: 2, question: "What is a heat engine and how efficient can it be?", options: ["100% efficiency always", "Device converting heat to work; efficiency = W/Q_in ≤ T_cold/T_hot", "Never efficient", "Forbidden"], correct: 1 },
        { id: 3, question: "How does electric field strength relate to distance?", options: ["Linear", "Inverse square (E = kq/r²); field strength decreases with distance squared", "No relationship", "Not measurable"], correct: 1 },
        { id: 4, question: "What is electric potential energy?", options: ["Kinetic energy", "Energy of charge in electric field (U = kq₁q₂/r)", "Not conserved", "No formula"], correct: 1 },
        { id: 5, question: "How does a conductor behave in an electric field?", options: ["Like an insulator", "Charges move to surface; field inside becomes zero at equilibrium", "Field unchanged", "Strengthens field"], correct: 1 },
        { id: 6, question: "What is an insulator and how does it respond to electric field?", options: ["Conducts electricity", "Material with electrons tightly bound; field slightly weakened by polarization", "Same as conductor", "No effect"], correct: 1 },
        { id: 7, question: "What is electric flux and Gauss's Law?", options: ["Meaningless", "Flux through closed surface proportional to enclosed charge (Φ = Q/ε₀)", "Not useful", "Only theory"], correct: 1 }
      ],
      // Physics Lesson 27 Worksheet 2: Voltage & DC Circuits
      "Voltage & DC Circuits": [
        { id: 1, question: "What is electric potential and how is it measured?", options: ["Force only", "Work per unit charge; measured in volts (V = J/C)", "Not measurable", "Only theoretical"], correct: 1 },
        { id: 2, question: "What is the difference between EMF and terminal voltage?", options: ["No difference", "EMF is ideal voltage; terminal voltage is reduced by internal resistance (V = EMF - Ir)", "Same thing", "Only EMF matters"], correct: 1 },
        { id: 3, question: "How do you analyze circuits using Kirchhoff's Laws?", options: ["Impossible", "Junction rule: current sum = 0; loop rule: voltage sum = 0 around closed loop", "Guess values", "Not applicable"], correct: 1 },
        { id: 4, question: "What is a resistor and how does resistance affect circuit?", options: ["Conducts perfectly", "Device opposing current flow; limits current and dissipates power as heat", "Helps current", "No effect"], correct: 1 },
        { id: 5, question: "How are resistors arranged in series versus parallel?", options: ["Same effect", "Series: total R = R₁+R₂; parallel: 1/R_total = 1/R₁ + 1/R₂", "Same resistance", "No difference"], correct: 1 },
        { id: 6, question: "What is the time constant of an RC circuit?", options: ["Not important", "τ = RC; determines charging/discharging rate (63% in one τ)", "Constant always", "Not defined"], correct: 1 },
        { id: 7, question: "How is power distributed in circuits?", options: ["Equally always", "P = VI = I²R = V²/R; depends on resistance and current flow", "Not conserved", "Can't calculate"], correct: 1 }
      ],
      // Physics Lesson 28 Worksheet 2: Magnetism & Induction
      "Magnetism & Induction": [
        { id: 1, question: "What is the magnetic force on a current-carrying wire?", options: ["No force", "F = BIL sinθ; proportional to field, current, and length", "Always zero", "Undefined"], correct: 1 },
        { id: 2, question: "How does a magnetic field form around a current-carrying wire?", options: ["Doesn't form", "Concentric circles around wire (right-hand rule determines direction)", "No field", "Field is linear"], correct: 1 },
        { id: 3, question: "What is mutual inductance and self-inductance?", options: ["Same", "Self: inductance of coil affects itself (L); mutual: inductance between coils", "No difference", "Not applicable"], correct: 1 },
        { id: 4, question: "How does changing magnetic flux induce EMF?", options: ["No induction", "Induced EMF = -dΦ/dt; magnitude depends on rate of flux change", "Proportional to flux", "No formula"], correct: 1 },
        { id: 5, question: "What is a transformer and how does it work?", options: ["Not useful", "Changes voltage using two coils and changing magnetic flux; N₁/N₂ = V₁/V₂", "Doesn't work", "Only for DC"], correct: 1 },
        { id: 6, question: "How does an inductor behave in circuits?", options: ["Like a resistor", "Opposes current changes; stores energy in magnetic field (V = L(dI/dt))", "No effect", "Conducts perfectly"], correct: 1 },
        { id: 7, question: "What are eddy currents and when do they occur?", options: ["Not real", "Circular currents induced in conductors by changing magnetic flux; cause heat loss", "Only in circuits", "Beneficial always"], correct: 1 }
      ],
      // Physics Lesson 29 Worksheet 2: Optics & Light Behavior
      "Optics & Light Behavior": [
        { id: 1, question: "What is the refractive index and how does it affect light?", options: ["Not important", "Ratio of light speed in vacuum to speed in medium; determines how much light bends", "Always 1", "Doesn't affect"], correct: 1 },
        { id: 2, question: "What is total internal reflection and when does it occur?", options: ["Never happens", "Light reflects entirely when angle exceeds critical angle (sin θc = n₂/n₁)", "Rare event", "No conditions"], correct: 1 },
        { id: 3, question: "How do lenses form images and what is focal length?", options: ["No image", "Focal length determines where parallel rays converge (1/f = 1/do + 1/di)", "Always infinity", "Not defined"], correct: 1 },
        { id: 4, question: "What is the difference between real and virtual images?", options: ["No difference", "Real: light converges (inverted, on screen); virtual: light diverges (upright, not on screen)", "Same thing", "Only real exists"], correct: 1 },
        { id: 5, question: "What causes diffraction and what is diffraction grating?", options: ["Not a cause", "Diffraction from waves bending around obstacles; grating has many slits for pattern analysis", "Only reflection", "No grating"], correct: 1 },
        { id: 6, question: "What is Young's Double Slit Experiment?", options: ["Not important", "Light from two slits interferes, creating alternating bright/dark fringes (proof of wave nature)", "No interference", "Only particles"], correct: 1 },
        { id: 7, question: "How does polarization reveal the wave nature of light?", options: ["Doesn't show", "Electromagnetic waves can be polarized in perpendicular directions to propagation", "Particles polarize", "No evidence"], correct: 1 }
      ],
      // Physics Lesson 30 Worksheet 2: Modern Physics & Relativity
      "Modern Physics & Relativity": [
        { id: 1, question: "What is the speed of light postulate in special relativity?", options: ["Not constant", "Speed of light in vacuum is same for all inertial observers (c ≈ 3×10⁸ m/s)", "Relative to observer", "Variable"], correct: 1 },
        { id: 2, question: "What is mass-energy equivalence and why is it significant?", options: ["Not real", "E = mc²; tiny mass equals enormous energy; explains nuclear reactions", "Only theoretical", "No applications"], correct: 1 },
        { id: 3, question: "What is the uncertainty principle and what does it state?", options: ["Not real", "Cannot simultaneously know position and momentum with arbitrary precision (ΔxΔp ≥ ℏ/2)", "False principle", "No validity"], correct: 1 },
        { id: 4, question: "What is wave function in quantum mechanics?", options: ["Not important", "Mathematical description of quantum state; squared magnitude gives probability density", "Only position", "No meaning"], correct: 1 },
        { id: 5, question: "How does the photon concept explain the photoelectric effect?", options: ["Doesn't explain", "Photons have discrete energy (E = hf); explains why threshold frequency exists", "Waves better", "Irrelevant"], correct: 1 },
        { id: 6, question: "What is the Bohr model of the atom?", options: ["Completely accurate", "Electrons orbit nucleus in quantized levels; explains hydrogen spectrum but oversimplified", "Always correct", "No validity"], correct: 1 },
        { id: 7, question: "What are the four fundamental forces and their relative strengths?", options: ["Not fundamental", "Strong nuclear, weak nuclear, electromagnetic, gravity; strong >> EM >> weak >> gravity", "All equal", "No comparison"], correct: 1 }
      ],
      // Environmental Science Lesson 31 Worksheet 2: Foundations & The History of Life
      "Foundations & The History of Life": [
        { id: 1, question: "How is geological time organized and why is it important?", options: ["Not important", "Organized into eons, eras, periods using index fossils and radiometric dating for timescale", "Random", "No organization"], correct: 1 },
        { id: 2, question: "What were the Cambrian Explosion and its significance?", options: ["Not important", "Rapid diversification of animal phyla; shows major evolutionary innovation period", "Minor event", "No significance"], correct: 1 },
        { id: 3, question: "How did life transition from water to land?", options: ["Never happened", "Fish developed limbs; plants developed roots, stems, cuticles for moisture retention", "Instantaneous", "Not documented"], correct: 1 },
        { id: 4, question: "What caused major extinction events in Earth's history?", options: ["Natural variations", "Asteroids, volcanism, climate change, oxygen levels; K-Pg extinction from asteroid impact", "No causes", "Unpredictable"], correct: 1 },
        { id: 5, question: "How does the fossil record show evolutionary progression?", options: ["It doesn't", "Shows increasing complexity and species changes over geological time", "Only current species", "Contradicts evolution"], correct: 1 },
        { id: 6, question: "What is the role of genetic evidence in understanding evolutionary history?", options: ["Not useful", "DNA similarity shows common ancestry; molecular clocks estimate divergence times", "Less reliable", "No information"], correct: 1 },
        { id: 7, question: "How have humans impacted extinction rates on Earth?", options: ["No impact", "Habitat loss, pollution, climate change cause 100-1000x natural extinction rate", "Beneficial", "Negligible"], correct: 1 }
      ],
      // Environmental Science Lesson 32 Worksheet 2: Plant Biology & Evolution
      "Plant Biology & Evolution": [
        { id: 1, question: "What are the major groups of plants and their characteristics?", options: ["Only one type", "Bryophytes (no vascular tissue), Pteridophytes (seedless vascular), Gymnosperms (naked seeds), Angiosperms (enclosed seeds)", "No groups", "Not distinct"], correct: 1 },
        { id: 2, question: "How do angiosperms reproduce differently than gymnosperms?", options: ["No difference", "Angiosperms have flowers and fruits; double fertilization produces endosperm", "Same", "No distinction"], correct: 1 },
        { id: 3, question: "What is photosynthesis and what is its overall equation?", options: ["No equation", "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂; conversion of light to chemical energy", "Reverse of respiration", "No products"], correct: 1 },
        { id: 4, question: "How do C3, C4, and CAM plants differ in carbon fixation?", options: ["All same", "C3 (RuBP fixation), C4 (PEP fixation, concentrates CO₂), CAM (nighttime stomata opening)", "No difference", "Not relevant"], correct: 1 },
        { id: 5, question: "What is the role of plant hormones in growth and development?", options: ["No role", "Auxins, gibberellins, ethylene, cytokinins regulate growth, flowering, fruit ripening", "No effect", "Not important"], correct: 1 },
        { id: 6, question: "How do plants respond to environmental stimuli (tropisms)?", options: ["They don't", "Phototropism (light), gravitropism (gravity), hydrotropism (water) guide growth", "No response", "Random"], correct: 1 },
        { id: 7, question: "What is the relationship between plants and pollinators in evolution?", options: ["Not related", "Coevolution: plants evolved flowers to attract pollinators for reproduction", "Plants don't depend", "Independent"], correct: 1 }
      ],
      // Environmental Science Lesson 33 Worksheet 2: Botany - Reproduction & Senses
      "Botany - Reproduction & Senses": [
        { id: 1, question: "What is the alternation of generations in plants?", options: ["No alternation", "Diploid sporophyte alternates with haploid gametophyte throughout plant life", "Only one stage", "Not documented"], correct: 1 },
        { id: 2, question: "How do plants sense gravity and light?", options: ["They don't", "Statoliths detect gravity; phototropins detect light; guide directional growth", "No sensing", "Random movement"], correct: 1 },
        { id: 3, question: "What is double fertilization in angiosperms?", options: ["Not unique", "One sperm fertilizes egg (zygote), other fertilizes polar nuclei (endosperm)", "Single process", "No fertilization"], correct: 1 },
        { id: 4, question: "How do plant roots function and what are root systems?", options: ["Structural only", "Absorb water/minerals; tap root (deep) vs fibrous (shallow) systems", "No function", "Above ground"], correct: 1 },
        { id: 5, question: "What is transpiration and how does it relate to water transport?", options: ["No relation", "Water evaporates from leaves; creates tension pulling water up from roots", "Separate process", "No connection"], correct: 1 },
        { id: 6, question: "How do stomata regulate gas exchange and water loss?", options: ["No regulation", "Guard cells control opening/closing; open for CO₂, close during stress to conserve water", "Always open", "Cannot regulate"], correct: 1 },
        { id: 7, question: "What is vegetative reproduction and its advantage?", options: ["Not possible", "Asexual reproduction via runners, bulbs, fragmentation; produces genetically identical plants", "Always sexual", "No advantage"], correct: 1 }
      ],
      // Environmental Science Lesson 34 Worksheet 2: Zoology - Insects to Reptiles
      "Zoology - Insects to Reptiles": [
        { id: 1, question: "What characteristics define insects and what are their major orders?", options: ["Only flies", "Six legs, three body parts, open circulatory system; Coleoptera, Lepidoptera, Hymenoptera, Diptera", "No characteristics", "Unclear"], correct: 1 },
        { id: 2, question: "How do insects undergo metamorphosis?", options: ["Not possible", "Complete (egg→larva→pupa→adult) vs incomplete (egg→nymph→adult)", "Random changes", "No transformation"], correct: 1 },
        { id: 3, question: "What is the role of insects in ecosystems?", options: ["Minimal", "Pollination, decomposition, food chains; most diverse animals on Earth", "All harmful", "Not important"], correct: 1 },
        { id: 4, question: "What features distinguish reptiles from amphibians?", options: ["No difference", "Reptiles: dry skin, eggs with shell, kidneys concentrate urine; amphibians: moist skin", "Always same", "No distinction"], correct: 1 },
        { id: 5, question: "How do reptiles thermoregulate?", options: ["Like mammals", "Ectothermic: rely on environment for body heat; basking, burrowing behavior", "Warm-blooded", "No regulation"], correct: 1 },
        { id: 6, question: "What adaptations help reptiles survive diverse environments?", options: ["No adaptations", "Camouflage, venom, scale patterns, behavioral thermoregulation, specialized diet", "All identical", "Unchanging"], correct: 1 },
        { id: 7, question: "How do reptile reproduction strategies differ by species?", options: ["All the same", "Egg-laying (most), parthenogenesis (some lizards), ovoviviparity (some snakes)", "No variation", "Random"], correct: 1 }
      ],
      // Environmental Science Lesson 35 Worksheet 2: Zoology - Behavior & Interaction
      "Zoology - Behavior & Interaction": [
        { id: 1, question: "What is ethology and what behaviors does it study?", options: ["Not a science", "Study of animal behavior in natural context; territoriality, courtship, migration", "Only domestic", "No field"], correct: 1 },
        { id: 2, question: "What is the difference between innate and learned behavior?", options: ["No difference", "Innate: genetic, immediate (instincts); learned: experience-based (conditioning, imitation)", "All innate", "No distinction"], correct: 1 },
        { id: 3, question: "How do animals communicate and why is it important?", options: ["Not important", "Visual, auditory, chemical, tactile signals for mating, alarm, territorial claims", "Only vocalization", "No importance"], correct: 1 },
        { id: 4, question: "What is symbiosis and what are its types?", options: ["Not real", "Close relationship: mutualism (beneficial both), commensalism (one benefits), parasitism (one harms)", "Only mutualism", "No types"], correct: 1 },
        { id: 5, question: "How do predator-prey relationships influence population dynamics?", options: ["No influence", "Predator controls prey; lag causes oscillating population cycles", "Independent", "No relationship"], correct: 1 },
        { id: 6, question: "What is social structure in animal groups?", options: ["Chaos", "Hierarchies, division of labor, communication systems; varies by species", "No structure", "Always random"], correct: 1 },
        { id: 7, question: "How do animals adapt behaviors to seasonal changes?", options: ["No adaptation", "Migration, hibernation, estivation, breeding cycles adjust to seasonal availability", "No change", "Always same"], correct: 1 }
      ],
      // Environmental Science Lesson 36 Worksheet 2: Ecology - Populations & Growth
      "Ecology - Populations & Growth": [
        { id: 1, question: "What is population growth rate and how is it calculated?", options: ["Not applicable", "r = ln(Nt/N₀)/t; intrinsic rate of increase per capita per unit time", "No formula", "Always one"], correct: 1 },
        { id: 2, question: "What is the difference between exponential and logistic growth?", options: ["No difference", "Exponential: unlimited J-curve; logistic: limited S-curve with carrying capacity", "Always same", "No distinction"], correct: 1 },
        { id: 3, question: "What is carrying capacity and what determines it?", options: ["Not important", "Maximum population environment can sustain; limited by resources, space, disease", "Infinite", "Not defined"], correct: 1 },
        { id: 4, question: "What are density-dependent versus density-independent factors?", options: ["No difference", "Density-dependent (disease, predation) increase with population; density-independent (climate) don't", "Same thing", "Not distinct"], correct: 1 },
        { id: 5, question: "How do age structure and reproductive rate affect population?", options: ["No effect", "More reproductive individuals → higher growth; age distribution predicts future growth", "Independent", "Not related"], correct: 1 },
        { id: 6, question: "What is emigration and immigration and their effects?", options: ["Not important", "Immigration (in) increases; emigration (out) decreases population size", "No effect", "Irrelevant"], correct: 1 },
        { id: 7, question: "How do human population dynamics differ from other species?", options: ["No difference", "Exponential growth with technological support; exceeded carrying capacity; must manage resources", "Always same", "No distinction"], correct: 1 }
      ],
      // Environmental Science Lesson 37 Worksheet 2: Ecology - Ecosystems & Cycles
      "Ecology - Ecosystems & Cycles": [
        { id: 1, question: "What is ecosystem productivity and how is it measured?", options: ["Not important", "Primary productivity: rate of energy fixation by producers (measured in biomass/time)", "No measurement", "Not defined"], correct: 1 },
        { id: 2, question: "What is the difference between food chains and food webs?", options: ["No difference", "Food chain: linear feeding sequence; food web: interconnected chains showing complex relationships", "Same", "Not distinct"], correct: 1 },
        { id: 3, question: "How does energy flow through trophic levels?", options: ["Equally", "Approximately 10% to next level (90% lost as heat); limits pyramid height", "All transferred", "No loss"], correct: 1 },
        { id: 4, question: "What is bioaccumulation and biomagnification?", options: ["Not harmful", "Toxins accumulate in organisms; magnify in higher trophic levels causing concentration", "No effect", "Beneficial"], correct: 1 },
        { id: 5, question: "How does the nitrogen cycle sustain ecosystems?", options: ["Not important", "Nitrogen fixation, nitrification, denitrification cycle N through biosphere and atmosphere", "No cycling", "Insignificant"], correct: 1 },
        { id: 6, question: "What is the phosphorus cycle and why is it important?", options: ["Not crucial", "Slow cycle through rocks, soil, water; essential for DNA, ATP, bones; no atmospheric phase", "Fast like nitrogen", "No importance"], correct: 1 },
        { id: 7, question: "How do decomposers maintain ecosystem function?", options: ["Unimportant", "Break down dead organic matter, return nutrients to soil, enable nutrient cycling", "Only harmful", "Not needed"], correct: 1 }
      ],
      // Environmental Science Lesson 38 Worksheet 2: Biomes & Biodiversity
      "Biomes & Biodiversity": [
        { id: 1, question: "What defines biomes and what are the major terrestrial biomes?", options: ["Not definable", "Large regions defined by climate and organisms; tropical rainforest, deciduous forest, grassland, tundra, desert, coniferous forest", "No major types", "Unclear"], correct: 1 },
        { id: 2, question: "How do tropical rainforests maintain biodiversity despite poor soils?", options: ["They don't", "Nutrient cycling efficiency, high productivity, diverse niches support extreme species richness", "No mechanisms", "Not understood"], correct: 1 },
        { id: 3, question: "What are aquatic biomes and their characteristics?", options: ["All same", "Freshwater (low salinity) and marine (high salinity) with distinct zones by depth", "No difference", "Not distinct"], correct: 1 },
        { id: 4, question: "What is biodiversity and why is it important for ecosystem function?", options: ["Not important", "Species variety at genetic and ecosystem levels; increases stability, productivity, resilience", "No importance", "Not necessary"], correct: 1 },
        { id: 5, question: "How do species occupy different ecological niches?", options: ["Overlaps always", "Resource partitioning: different food, habitat, time; reduces direct competition", "No variation", "Identical"], correct: 1 },
        { id: 6, question: "What threatens biodiversity globally?", options: ["Nothing", "Habitat loss (greatest threat), pollution, climate change, overexploitation, invasive species", "No threats", "Minor issues"], correct: 1 },
        { id: 7, question: "How can conservation preserve biodiversity for future generations?", options: ["Impossible", "Protected areas, habitat restoration, sustainable practices, reduce emissions, species programs", "No solutions", "Can't prevent"], correct: 1 }
      ],
      // Environmental Science Lesson 39 Worksheet 2: The Future of Life
      "The Future of Life": [
        { id: 1, question: "What is climate change and what is its primary cause?", options: ["Not real", "Rising global temperatures primarily from human greenhouse gas emissions", "Natural only", "No cause"], correct: 1 },
        { id: 2, question: "How are species adapting to rapid environmental change?", options: ["Not adapting", "Behavioral changes, range shifts, rapid evolution; adaptation may not keep pace with change", "No adaptation", "Cannot change"], correct: 1 },
        { id: 3, question: "What are tipping points in climate systems?", options: ["Not real", "Critical thresholds where system shifts to different state (ice sheets, ocean circulation)", "Theoretical", "Cannot occur"], correct: 1 },
        { id: 4, question: "How can renewable energy reduce environmental impact?", options: ["Can't help", "Solar, wind, geothermal reduce carbon emissions and fossil fuel dependence", "Not effective", "No advantage"], correct: 1 },
        { id: 5, question: "What is ecosystem restoration and why is it important?", options: ["Not possible", "Actively restoring degraded ecosystems to functionality; recovers species and services", "No importance", "Not needed"], correct: 1 },
        { id: 6, question: "How can agriculture become more sustainable?", options: ["Cannot improve", "Soil conservation, reduced chemicals, crop diversity, precision farming, agroforestry", "No changes", "Unsustainable"], correct: 1 },
        { id: 7, question: "What is the relationship between human population and environmental impact?", options: ["No relationship", "Population × consumption per capita = impact; controlling both critical for sustainability", "Independent", "No connection"], correct: 1 }
      ],
      // Economics Lesson 41 Worksheet 2: The Foundation of Choice
      "The Foundation of Choice": [
        { id: 1, question: "How do different economic systems allocate resources?", options: ["No differences", "Command uses planning, market uses prices, mixed uses both; efficiency and equity vary", "All identical", "No allocation"], correct: 1 },
        { id: 2, question: "What is the production possibilities curve (PPC)?", options: ["Not real", "Shows maximum production combinations with given resources; illustrates trade-offs", "Always linear", "No meaning"], correct: 1 },
        { id: 3, question: "How does comparative advantage benefit trade?", options: ["No benefit", "Each specializes where most efficient; both gain through exchange", "Always harmful", "No gain"], correct: 1 },
        { id: 4, question: "What determines market prices in equilibrium?", options: ["Government", "Where quantity supplied equals quantity demanded; signals scarcity", "Random", "Not determined"], correct: 1 },
        { id: 5, question: "What is the role of incentives in economics?", options: ["Not important", "People respond to incentives; shape behavior and market outcomes", "No effect", "Irrelevant"], correct: 1 },
        { id: 6, question: "How do economies balance growth with stability?", options: ["Not possible", "Central banks and governments manage inflation, employment, growth simultaneously", "Easy to balance", "No tradeoff"], correct: 1 },
        { id: 7, question: "What is economic efficiency?", options: ["Theoretical", "Producing maximum output from resources; occurs at competitive equilibrium", "Not achievable", "Never happens"], correct: 1 }
      ],
      // Economics Lesson 42 Worksheet 2: Measuring Economic Health
      "Measuring Economic Health": [
        { id: 1, question: "What are the components of GDP?", options: ["Not important", "Consumption, investment, government spending, net exports (C+I+G+NX)", "Only production", "No formula"], correct: 1 },
        { id: 2, question: "How is the unemployment rate calculated?", options: ["All jobless", "Unemployed/labor force; excludes discouraged workers; imperfect measure", "Not measurable", "All without jobs"], correct: 1 },
        { id: 3, question: "What is the relationship between unemployment and inflation?", options: ["No relationship", "Phillips curve: inverse relationship; policy tradeoff between the two", "Always together", "Not related"], correct: 1 },
        { id: 4, question: "How do economists measure cost of living?", options: ["Not possible", "Consumer Price Index tracks basket of goods; reveals purchasing power changes", "Subjective", "No measure"], correct: 1 },
        { id: 5, question: "What is aggregate demand and supply?", options: ["Same", "Total economy-wide demand/supply; intersection determines price level, output", "No interaction", "No equilibrium"], correct: 1 },
        { id: 6, question: "What indicates economic recession?", options: ["Not definable", "Sustained negative GDP growth, rising unemployment, declining consumer confidence", "No signals", "Unpredictable"], correct: 1 },
        { id: 7, question: "What is the difference between nominal and real GDP?", options: ["No difference", "Nominal uses current prices; real adjusts for inflation revealing actual growth", "Same thing", "Not distinct"], correct: 1 }
      ],
      // Economics Lesson 43 Worksheet 2: Government & Fiscal Policy
      "Government & Fiscal Policy": [
        { id: 1, question: "What is the multiplier effect?", options: ["Not real", "Initial spending increase stimulates more spending in cascade; multiplier > 1", "No effect", "Negative"], correct: 1 },
        { id: 2, question: "What are automatic stabilizers?", options: ["Not useful", "Taxes and benefits adjust automatically reducing economic swings (unemployment insurance, progressive tax)", "Manual only", "No effect"], correct: 1 },
        { id: 3, question: "What is crowding out?", options: ["Not real", "Government borrowing raises interest rates, reducing private investment", "Doesn't happen", "Always positive"], correct: 1 },
        { id: 4, question: "What are transfer payments?", options: ["Same as spending", "Government payments not for production (welfare, pensions); don't directly increase GDP", "Create jobs", "No effect"], correct: 1 },
        { id: 5, question: "How do tariffs and quotas protect industries?", options: ["Always helpful", "Restrict imports, raising prices, protecting domestic producers; reduce competition, efficiency", "No effect", "Always harmful"], correct: 1 },
        { id: 6, question: "What is the relationship between tax rate and revenue?", options: ["Linear", "Laffer curve shows inverted-U; higher rates may reduce revenue if they reduce activity", "Always linear", "Not related"], correct: 1 },
        { id: 7, question: "What are long-term fiscal policy challenges?", options: ["No challenges", "Aging population, rising healthcare costs, debt sustainability threatening future growth", "Manageable", "Not real"], correct: 1 }
      ],
      // Economics Lesson 44 Worksheet 2: Money, Banking & The Fed
      "Money, Banking & The Fed": [
        { id: 1, question: "What are the money supply measures (M1, M2, M3)?", options: ["No distinction", "M1 (cash+checking), M2 (M1+savings), M3 (M2+large deposits); different liquidity", "Same thing", "Not defined"], correct: 1 },
        { id: 2, question: "What is quantitative easing and why use it?", options: ["Not real", "Central bank purchases securities increasing money supply when rates already near zero", "No purpose", "Temporary"], correct: 1 },
        { id: 3, question: "What is the relationship between inflation and interest rates?", options: ["No relationship", "Higher inflation expectations raise rates; higher rates reduce borrowing and inflation", "Independent", "Always same"], correct: 1 },
        { id: 4, question: "How do reserve requirements affect lending?", options: ["No effect", "Lower requirements allow more lending; increases money supply and inflation risk", "No relationship", "Irrelevant"], correct: 1 },
        { id: 5, question: "What causes bank runs and systemic risk?", options: ["Not possible", "Loss of confidence causes deposit withdrawals, failures, contagion; requires regulation", "Doesn't happen", "No consequence"], correct: 1 },
        { id: 6, question: "What is the yield curve and what does it signal?", options: ["Not meaningful", "Relationship between bond maturity and yield; inverted curve predicts recession", "Flat always", "No signal"], correct: 1 },
        { id: 7, question: "What is the lender of last resort function?", options: ["Not important", "Central bank loans to banks in crisis preventing systemic collapse", "No role", "Not needed"], correct: 1 }
      ],
      // Economics Lesson 45 Worksheet 2: Global Markets & Trade
      "Global Markets & Trade": [
        { id: 1, question: "What is the theory of absolute advantage?", options: ["Not real", "Country producing more efficiently (fewer inputs); doesn't guarantee beneficial trade", "Always superior", "No basis"], correct: 1 },
        { id: 2, question: "What are the effects of appreciation/depreciation on trade?", options: ["No effect", "Strong currency makes exports expensive, imports cheaper; weak currency opposite", "Same outcome", "Not related"], correct: 1 },
        { id: 3, question: "What is dumping and why is it controversial?", options: ["Not real", "Selling below cost internationally; harms competitors, may trigger retaliation", "Normal", "Not harmful"], correct: 1 },
        { id: 4, question: "What are the gains and losses from trade?", options: ["Only gains", "Gains overall but unevenly distributed; some workers/sectors hurt by competition", "Equal distribution", "Only losses"], correct: 1 },
        { id: 5, question: "What is foreign direct investment and its effects?", options: ["Not important", "Ownership of businesses in other countries; creates jobs, transfers technology, wealth extraction", "Irrelevant", "Always negative"], correct: 1 },
        { id: 6, question: "What is capital flight?", options: ["Not real", "Rapid movement of money out of country due to political/economic instability", "Doesn't happen", "Beneficial"], correct: 1 },
        { id: 7, question: "How do trade deficits affect the economy?", options: ["Not important", "Imports > exports; means foreign investment inflows; affects currency and asset prices", "Always bad", "No effect"], correct: 1 }
      ],
      // Economics Lesson 46 Worksheet 2: Microeconomics - Firms & Costs
      "Microeconomics - Firms & Costs": [
        { id: 1, question: "What is the relationship between average and marginal cost?", options: ["No relationship", "When MC < AC, AC decreases; when MC > AC, AC increases", "Always same", "Independent"], correct: 1 },
        { id: 2, question: "What is consumer surplus?", options: ["Not real", "Difference between what consumers willing to pay vs. actual price; measure of benefit", "No benefit", "Zero"], correct: 1 },
        { id: 3, question: "What is price discrimination and its effects?", options: ["Never happens", "Charging different prices to different customers; increases seller profit, affects equity", "Illegal always", "No effect"], correct: 1 },
        { id: 4, question: "What is the shutdown point for a firm?", options: ["Never happens", "When price falls below average variable cost; firm stops production (variable costs only)", "Not relevant", "At loss"], correct: 1 },
        { id: 5, question: "What are natural monopolies?", options: ["Not real", "Industries with high fixed costs (utilities); one large firm more efficient than many small", "Temporary", "No advantage"], correct: 1 },
        { id: 6, question: "What is vertical integration?", options: ["Not common", "Firm controls production stages (raw materials to retail); affects efficiency, market power", "Never", "No benefit"], correct: 1 },
        { id: 7, question: "What is asset specificity?", options: ["Not important", "Investments specific to relationship; creates switching costs affecting bargaining", "No importance", "No effect"], correct: 1 }
      ],
      // Economics Lesson 47 Worksheet 2: Competition & Market Structures
      "Competition & Market Structures": [
        { id: 1, question: "What are barriers to entry and their sources?", options: ["No barriers", "Scale economies, patents, capital requirements, switching costs, regulations", "Easily overcome", "Not real"], correct: 1 },
        { id: 2, question: "What is predatory pricing?", options: ["Not real", "Charging very low prices to eliminate competitors; illegal under antitrust law", "Normal practice", "Beneficial"], correct: 1 },
        { id: 3, question: "What is vertical restraint?", options: ["Not allowed", "Manufacturer restricts dealer behavior; can promote efficiency or harm competition", "Always legal", "No effect"], correct: 1 },
        { id: 4, question: "What is collusion and why do firms avoid it?", options: ["Always occurs", "Secret cooperation on pricing; difficult to maintain, enforcement impossible, unstable", "Easy to maintain", "Stable"], correct: 1 },
        { id: 5, question: "What is the Herfindahl index?", options: ["Not useful", "Measures concentration: sum of squared market shares; higher = more concentrated", "Only for perfect", "Meaningless"], correct: 1 },
        { id: 6, question: "What is cross-price elasticity?", options: ["Not important", "Percentage change in quantity demanded given price change of other good; shows substitutes/complements", "No relationship", "Not measurable"], correct: 1 },
        { id: 7, question: "What is deadweight loss from monopoly?", options: ["Not real", "Loss from underproduction due to monopoly markup; measures economic inefficiency", "No loss", "Zero"], correct: 1 }
      ],
      // Economics Lesson 48 Worksheet 2: Inequality & Human Welfare
      "Inequality & Human Welfare": [
        { id: 1, question: "What is Lorenz curve?", options: ["Not useful", "Graphs cumulative income distribution; closeness to diagonal shows equality", "Always equal", "No pattern"], correct: 1 },
        { id: 2, question: "What causes intergenerational mobility differences?", options: ["Just effort", "Differences in inherited wealth, education access, networks, discrimination", "Equal always", "Merit only"], correct: 1 },
        { id: 3, question: "What are the effects of income redistribution?", options: ["Only positive", "Reduces inequality, may reduce incentives for work/investment; tradeoff between equity and efficiency", "No tradeoff", "Only negative"], correct: 1 },
        { id: 4, question: "What is human capital and how is it measured?", options: ["Not real", "Skills, knowledge, education affecting earning potential and productivity", "Only IQ", "Can't measure"], correct: 1 },
        { id: 5, question: "What are remittances and their impact?", options: ["Not important", "Money sent by migrants to home countries; reduces poverty, affects inequality", "No impact", "Harmful"], correct: 1 },
        { id: 6, question: "What is universal basic income (UBI)?", options: ["Not feasible", "Unconditional regular payment to all; debates on work incentives, cost, effectiveness", "Always positive", "Never works"], correct: 1 },
        { id: 7, question: "How do taxes and transfers reduce inequality?", options: ["Can't", "Progressive taxation + targeted spending reduce Gini coefficient and poverty", "Never work", "Ineffective"], correct: 1 }
      ],
      // Economics Lesson 49 Worksheet 2: Behavioral Econ & Data
      "Behavioral Econ & Data": [
        { id: 1, question: "What is loss aversion?", options: ["Not real", "Losses feel worse than equivalent gains; affects risk-taking and financial decisions", "Not proven", "Doesn't apply"], correct: 1 },
        { id: 2, question: "What is mental accounting?", options: ["Not used", "People treat money differently by source/use creating cognitive categories", "No difference", "Not applicable"], correct: 1 },
        { id: 3, question: "What is present bias?", options: ["Not real", "Overvaluing immediate rewards vs. future; explains undersaving, overspending", "Doesn't happen", "Always patient"], correct: 1 },
        { id: 4, question: "What is the value of big data analytics?", options: ["Not useful", "Identifies patterns, predicts behavior, optimizes pricing, improves targeting", "No value", "Limited"], correct: 1 },
        { id: 5, question: "What are algorithmic biases and their consequences?", options: ["Not real", "AI reflects training data biases affecting hiring, lending, criminal justice outcomes", "Not a problem", "Impossible"], correct: 1 },
        { id: 6, question: "What is A/B testing and its applications?", options: ["Not valid", "Testing two versions to measure causal impact; used for websites, pricing, products", "Not reliable", "No use"], correct: 1 },
        { id: 7, question: "How can behavioral insights improve policy?", options: ["Not effective", "Nudges, framing, defaults affect behavior; low-cost interventions (retirement savings)", "Never work", "No impact"], correct: 1 }
      ],
      // Economics Lesson 50 Worksheet 2: The Future of the Global Economy
      "The Future of the Global Economy": [
        { id: 1, question: "What are the effects of technological disruption on employment?", options: ["No effect", "Eliminates jobs in some sectors, creates new ones; skills mismatch challenges remain", "Always negative", "Only positive"], correct: 1 },
        { id: 2, question: "What is the role of education in future competitiveness?", options: ["Not important", "Provides skills adaptability; STEM and soft skills increasingly critical", "Irrelevant", "Fixed skills"], correct: 1 },
        { id: 3, question: "What challenges do emerging markets face?", options: ["No challenges", "Middle-income trap, capital flight, political instability, commodity dependence", "Always develop", "No obstacles"], correct: 1 },
        { id: 4, question: "What is environmental economics and carbon pricing?", options: ["Not useful", "Economics of environmental issues; carbon tax/cap-and-trade internalizes costs", "No solution", "Theoretical"], correct: 1 },
        { id: 5, question: "What is universal health coverage and its costs?", options: ["Not feasible", "Government-guaranteed healthcare; different systems have tradeoffs in access, quality, cost", "Always expensive", "Impossible"], correct: 1 },
        { id: 6, question: "What is financial inclusion and why does it matter?", options: ["Not important", "Access to financial services; enables entrepreneurship, savings, insuring against shocks", "Not needed", "Irrelevant"], correct: 1 },
        { id: 7, question: "How can economies balance growth with sustainability?", options: ["Can't", "Green growth, circular economy, natural capital accounting transition toward sustainable development", "Always conflict", "No way"], correct: 1 }
      ],
      // History Lesson 51 Worksheet 2: Ancient Roots & Natural Philosophy
      "Ancient Roots & Natural Philosophy": [
        { id: 1, question: "What were the limitations of ancient Greek natural philosophy?", options: ["None", "Lacked precise instruments, experimentation, mathematics; based on logic and observation", "Perfect understanding", "No limits"], correct: 1 },
        { id: 2, question: "How did Plato and Aristotle differ in epistemology?", options: ["No difference", "Plato: abstract ideas; Aristotle: empirical observation and classification", "Same views", "Not relevant"], correct: 1 },
        { id: 3, question: "What was the astronomical model before Copernicus?", options: ["Heliocentric", "Geocentric with Earth center, celestial spheres, retrograde motion explanations", "Modern view", "Correct"], correct: 1 },
        { id: 4, question: "How did Islamic scholarship preserve knowledge?", options: ["Didn't", "Translated Greek texts, made discoveries in mathematics, astronomy, medicine", "Only religious", "Not scientific"], correct: 1 },
        { id: 5, question: "What technological advances enabled observation?", options: ["None needed", "Telescopes, microscopes, thermometers allowed measurement beyond naked eye", "Not important", "Recent only"], correct: 1 },
        { id: 6, question: "Why was the Dark Ages less scientifically advanced?", options: ["Not true", "Institutional decline, focus on survival, Church emphasis on faith over inquiry", "Most advanced", "Better period"], correct: 1 },
        { id: 7, question: "What is the relationship between mathematics and natural philosophy?", options: ["None", "Mathematics describes nature precisely; essential for physics and astronomy", "Only descriptive", "Separate fields"], correct: 1 }
      ],
      // History Lesson 52 Worksheet 2: The Scientific Revolution Begins
      "The Scientific Revolution Begins": [
        { id: 1, question: "What was the role of the Church in the Scientific Revolution?", options: ["Only support", "Mixture of support and resistance to ideas challenging doctrine (heliocentrism)", "Complete opposition", "No role"], correct: 1 },
        { id: 2, question: "What did Tycho Brahe accomplish?", options: ["Little", "Precise naked-eye astronomical observations; data basis for Kepler's laws", "Only theory", "No contribution"], correct: 1 },
        { id: 3, question: "What is the scientific method?", options: ["Just observation", "Observation, hypothesis, experimentation, analysis in iterative cycle", "Only theory", "No process"], correct: 1 },
        { id: 4, question: "How did patronage support scientific work?", options: ["Not at all", "Wealthy nobles/popes funded researchers enabling focus on inquiry", "No funding", "Hindered"], correct: 1 },
        { id: 5, question: "What was the significance of heliocentrism?", options: ["Minor", "Removed Earth from center; challenged cosmology and authority paradigms", "Just astronomy", "No impact"], correct: 1 },
        { id: 6, question: "How did mechanical philosophy influence thinking?", options: ["Not important", "Universe operates like machine with laws; replaced animism and magic", "Only metaphor", "Outdated"], correct: 1 },
        { id: 7, question: "What was the relationship between alchemy and chemistry?", options: ["No connection", "Alchemists developed techniques and equipment; evolved into systematic chemistry", "Same thing", "Unrelated"], correct: 1 }
      ],
      // History Lesson 53 Worksheet 2: Physics, Light & Gravity
      "Physics, Light & Gravity": [
        { id: 1, question: "How did Galileo challenge Aristotelian physics?", options: ["He didn't", "Inclined plane experiments showed uniform acceleration; objects fall at same rate", "Aristotle correct", "No evidence"], correct: 1 },
        { id: 2, question: "What was Kepler's great insight?", options: ["Circular orbits", "Elliptical orbits with sun at focus; mathematical basis for planetary motion", "Disproven", "Not important"], correct: 1 },
        { id: 3, question: "How did Newton unify terrestrial and celestial mechanics?", options: ["He didn't", "Universal gravitation applies everywhere; same laws govern falling apple and moon", "Different laws", "Theoretical only"], correct: 1 },
        { id: 4, question: "What was Newton's greatest discovery?", options: ["Just calculus", "Gravity: inverse square law unifying all motion through single principle", "Only math", "Many equal"], correct: 1 },
        { id: 5, question: "How did light experiments change understanding?", options: ["No change", "Prism dispersion showed white light is spectrum; enabled theories of color", "Not important", "No discovery"], correct: 1 },
        { id: 6, question: "What was Newton's corpuscular theory of light?", options: ["Rejected", "Light composed of particles; competed with wave theory for centuries", "Wave theory", "Never proposed"], correct: 1 },
        { id: 7, question: "What impact did Newtonian physics have?", options: ["Minor", "Dominated physics for 200 years; enabled engineering, navigation, accurate prediction", "Immediately replaced", "No applications"], correct: 1 }
      ],
      // History Lesson 54 Worksheet 2: Chemistry & The Unseen World
      "Chemistry & The Unseen World": [
        { id: 1, question: "What did alchemists contribute to chemistry?", options: ["Nothing", "Distillation, crystallization, purification techniques; laboratory skills foundation", "Pure science", "Harmful"], correct: 1 },
        { id: 2, question: "What was phlogiston theory and why was it wrong?", options: ["Correct", "Believed substance released in combustion; didn't account for weight changes", "Never believed", "Still valid"], correct: 1 },
        { id: 3, question: "Why was Lavoisier's work revolutionary?", options: ["Not special", "Established quantitative chemistry; conservation of mass; identified oxygen's role", "Just nomenclature", "Descriptive only"], correct: 1 },
        { id: 4, question: "How did atomic theory explain reactions?", options: ["Doesn't", "Atoms rearrange in fixed ratios conserving mass and predicting products", "Continuous", "No patterns"], correct: 1 },
        { id: 5, question: "What made the periodic table significant?", options: ["Just organization", "Revealed element patterns; predicted properties of undiscovered elements", "No prediction", "Arbitrary"], correct: 1 },
        { id: 6, question: "How did electrochemistry develop?", options: ["Unrelated", "Volta's battery enabled chemical decomposition; showed link between electricity and chemistry", "No connection", "Later"], correct: 1 },
        { id: 7, question: "What was the significance of valence?", options: ["Not important", "Number of bonds atoms form; explained compound formation systematically", "Just counting", "No pattern"], correct: 1 }
      ],
      // History Lesson 55 Worksheet 2: Biology, Life & Deep Time
      "Biology, Life & Deep Time": [
        { id: 1, question: "What did the cell theory establish?", options: ["Nothing new", "Life's fundamental unit is the cell; all from pre-existing cells; unifying principle", "Not proven", "Theoretical"], correct: 1 },
        { id: 2, question: "How did geological evidence support evolution?", options: ["Didn't", "Rock layers showed species succession, transitions, extinctions over immense time", "Contradicts evolution", "Not reliable"], correct: 1 },
        { id: 3, question: "What was Lamarck's evolutionary mechanism?", options: ["Correct", "Inheritance of acquired traits; mechanism later disproven but raised evolution concept", "Modern view", "Never believed"], correct: 1 },
        { id: 4, question: "What evidence did Darwin use most compellingly?", options: ["Anecdotes only", "Biogeography (island species), homologous structures, artificial selection, fossils", "Pure observation", "No evidence"], correct: 1 },
        { id: 5, question: "What is natural selection's mechanism?", options: ["Random", "Variation + competition + heredity → differential survival and reproduction", "Directed change", "No mechanism"], correct: 1 },
        { id: 6, question: "Why was evolution so controversial?", options: ["Scientific only", "Challenged religious creation myths; implied human-animal kinship; removed design", "Everyone agreed", "Minor issue"], correct: 1 },
        { id: 7, question: "How did evolution unite all biology?", options: ["Didn't", "Common descent explained diversity, unity, adaptation; organizing principle for life sciences", "Separate theories", "No connection"], correct: 1 }
      ],
      // History Lesson 56 Worksheet 2: Medicine & The Human Body
      "Medicine & The Human Body": [
        { id: 1, question: "How did germ theory transform medicine?", options: ["Minimally", "Sterilization, antibiotics, vaccines reduced mortality dramatically", "No impact", "Just theory"], correct: 1 },
        { id: 2, question: "What was Semmelweis's discovery about infection?", options: ["Not real", "Hand-washing reduced childbed fever mortality; challenged miasma theory", "No evidence", "Unrelated"], correct: 1 },
        { id: 3, question: "What were early vaccines and their limitations?", options: ["Always worked", "Jennerian vaccination used cowpox; worked but mechanism unknown until virology", "Never effective", "No science"], correct: 1 },
        { id: 4, question: "What did Mendel discover about inheritance?", options: ["Complex", "Simple laws of segregation and assortment; genes control traits in discrete units", "Continuous", "No pattern"], correct: 1 },
        { id: 5, question: "How did DNA structure explain heredity?", options: ["Doesn't", "Double helix with base pairing showed replication mechanism and information storage", "Still mystery", "Wrong"], correct: 1 },
        { id: 6, question: "What enabled genetic engineering?", options: ["Natural", "Restriction enzymes and recombinant DNA technology; allows precise gene manipulation", "Not possible", "Accidental"], correct: 1 },
        { id: 7, question: "How did microscopy revolutionize medicine?", options: ["Didn't", "Revealed bacteria, cells, viruses; enabled diagnosis and understanding disease mechanisms", "Just observation", "No help"], correct: 1 }
      ],
      // History Lesson 57 Worksheet 2: Electricity & Thermodynamics
      "Electricity & Thermodynamics": [
        { id: 1, question: "What was Volta's contribution to electricity?", options: ["Theory only", "Battery (voltaic pile) produced sustained current; enabled electrochemistry", "Just math", "Theoretical"], correct: 1 },
        { id: 2, question: "What did Faraday discover about induction?", options: ["Not real", "Changing magnetic field induces electric field; basis of transformers and generators", "Same phenomenon", "Disproven"], correct: 1 },
        { id: 3, question: "What was the significance of Ohm's Law?", options: ["Just equation", "Quantified relationship enabling circuit design and electrical engineering", "Theoretical", "No application"], correct: 1 },
        { id: 4, question: "How did electricity transform society?", options: ["Minimally", "Telegraph, light, motors, power distribution revolutionized communication, work, life", "Minor change", "Temporary"], correct: 1 },
        { id: 5, question: "What were the laws of thermodynamics?", options: ["No laws", "First: energy conservation; Second: entropy increases; govern all heat processes", "Theoretical", "Not proven"], correct: 1 },
        { id: 6, question: "How did steam engine theory develop?", options: ["No theory", "Carnot's cycle showed theoretical maximum efficiency; enabled optimization", "Just practice", "No science"], correct: 1 },
        { id: 7, question: "What unified electricity and magnetism?", options: ["Nothing", "Maxwell's equations showed they're aspects of electromagnetism; light is EM wave", "Separate", "No connection"], correct: 1 }
      ],
      // History Lesson 58 Worksheet 2: The Modern Physics Revolution
      "The Modern Physics Revolution": [
        { id: 1, question: "What did the Michelson-Morley experiment really show?", options: ["Ether exists", "Light speed constant; no ether needed; challenged classical assumptions", "Movement measured", "Inconclusive"], correct: 1 },
        { id: 2, question: "What was radical about special relativity?", options: ["Just motion", "Space and time relative; mass-energy equivalent; nothing faster than light", "Minor adjustment", "No change"], correct: 1 },
        { id: 3, question: "What is spacetime and its importance?", options: ["Not real", "Unified space-time continuum; gravity curves spacetime; explained in general relativity", "Only concept", "Theoretical"], correct: 1 },
        { id: 4, question: "What did Planck's quantum hypothesis solve?", options: ["Nothing", "Ultraviolet catastrophe; showed energy quantized in discrete units (photons)", "Not a problem", "No solution"], correct: 1 },
        { id: 5, question: "What was revolutionary about quantum mechanics?", options: ["Nothing new", "Probabilistic nature of reality; uncertainty principle; superposition; not deterministic", "Deterministic", "Certain"], correct: 1 },
        { id: 6, question: "What did Heisenberg's uncertainty principle mean?", options: ["Measurement error", "Fundamental: cannot simultaneously know position and momentum precisely", "Can measure precisely", "Just measurement"], correct: 1 },
        { id: 7, question: "How did modern physics change worldview?", options: ["Didn't", "Removed absolute space/time, determinism, local realism; probabilistic universe", "Minor change", "No impact"], correct: 1 }
      ],
      // History Lesson 59 Worksheet 2: Information & The Digital Age
      "Information & The Digital Age": [
        { id: 1, question: "What was the Turing machine concept?", options: ["Not important", "Theoretical machine that could compute anything computable; foundation of computer theory", "Just machine", "Impractical"], correct: 1 },
        { id: 2, question: "What made electronic computers possible?", options: ["Already existed", "Transistors and integrated circuits enabled miniaturization and speed", "Mechanical only", "Not feasible"], correct: 1 },
        { id: 3, question: "What was Moore's Law's significance?", options: ["Not real", "Transistor count doubles ~2 years; predicted exponential computing power growth", "Linear growth", "Disproven"], correct: 1 },
        { id: 4, question: "How did the internet originate?", options: ["Corporate", "ARPANET for military communication; evolved into decentralized global network", "Government only", "Commercial"], correct: 1 },
        { id: 5, question: "What made the World Wide Web revolutionary?", options: ["Just files", "Hypertext system made information navigation intuitive; democratized publishing", "No innovation", "Just protocol"], correct: 1 },
        { id: 6, question: "What is Shannon's information theory?", options: ["Not useful", "Quantified information, compression, transmission; foundation of digital communication", "Only math", "Theoretical"], correct: 1 },
        { id: 7, question: "How did digitalization enable AI research?", options: ["Not related", "Computing power enabled training large neural networks; data availability accelerated progress", "No connection", "Separate"], correct: 1 }
      ],
      // History Lesson 60 Worksheet 2: Science in the 21st Century
      "Science in the 21st Century": [
        { id: 1, question: "What made climate science increasingly compelling?", options: ["Weak evidence", "Multiple independent datasets, paleoclimate records, paleoclimate records show anthropogenic warming", "No consensus", "Debated"], correct: 1 },
        { id: 2, question: "What enabled genomic medicine?", options: ["Impossible", "DNA sequencing technology, bioinformatics, CRISPR enabling personalized treatment", "Never works", "Theoretical"], correct: 1 },
        { id: 3, question: "What is the role of computational science?", options: ["Limited", "Simulations, modeling, data analysis accelerate discovery in physics, biology, climate", "Just graphs", "No value"], correct: 1 },
        { id: 4, question: "What made exoplanet discovery possible?", options: ["Not real", "Transit method, radial velocity detection, improved telescopes finding thousands", "Impossible", "Speculative"], correct: 1 },
        { id: 5, question: "What is gravitational wave detection's significance?", options: ["Not real", "LIGO detected merging black holes; confirmed Einstein's prediction; opened new astronomy", "No observation", "Theoretical"], correct: 1 },
        { id: 6, question: "What are the promise and challenges of AI?", options: ["All good", "Promise: discovery acceleration; challenges: bias, interpretability, ethics, job disruption", "All hype", "No impact"], correct: 1 },
        { id: 7, question: "What is Big Science and its impact?", options: ["Not important", "Large collaborative projects (CERN, JWST) requiring billions but advancing fundamental knowledge", "Small scale", "No cost"], correct: 1 }
      ],
      // Human Geography Lesson 61 Worksheet 2: Geographic Tools & Data
      "Geographic Tools & Data": [
        { id: 1, question: "What are the advantages of satellite remote sensing?", options: ["Limited use", "Covers large areas, monitors changes, provides consistent data, accesses remote regions", "Only ground surveys", "No advantages"], correct: 1 },
        { id: 2, question: "How has GIS transformed geographic analysis?", options: ["No change", "Integrates spatial data layers enabling pattern analysis, modeling, prediction", "Just mapping", "Minimal impact"], correct: 1 },
        { id: 3, question: "What information does GPS provide and how?", options: ["Only location", "Position, velocity, time via satellite signals; enables tracking, navigation, precision", "Not accurate", "Military only"], correct: 1 },
        { id: 4, question: "What are limitations of map projections?", options: ["None", "All distort either area, shape, distance, or direction; choosing projection involves tradeoffs", "Perfect representation", "Not relevant"], correct: 1 },
        { id: 5, question: "How do geographers use qualitative research?", options: ["Not rigorous", "Interviews, ethnography, observation provide deep contextual understanding of places", "No value", "Only quantitative"], correct: 1 },
        { id: 6, question: "What is the digital divide in geographic data?", options: ["Not real", "Unequal access to technology, internet, data infrastructure creates knowledge gaps", "Everyone has access", "Not important"], correct: 1 },
        { id: 7, question: "How do big data and crowd-sourcing affect geography?", options: ["No change", "Real-time information from social media, sensors, phones reveal patterns, behaviors", "Unreliable", "Limited use"], correct: 1 }
      ],
      // Human Geography Lesson 62 Worksheet 2: Plate Tectonics & Landforms
      "Plate Tectonics & Landforms": [
        { id: 1, question: "How do subduction zones create hazards?", options: ["No hazards", "Deep earthquakes, tsunamis, volcanic eruptions as plates collide and slide", "Stable areas", "Only mountains"], correct: 1 },
        { id: 2, question: "What landforms result from glaciation?", options: ["No effect", "U-shaped valleys, moraines, lakes, drumlins mark ice sheet activity", "Only erosion", "Temporary"], correct: 1 },
        { id: 3, question: "How do river systems shape landscapes over time?", options: ["No change", "Erosion, transport, deposition create valleys, deltas, floodplains", "Unchanged", "No process"], correct: 1 },
        { id: 4, question: "What determines mountain formation?", options: ["Random", "Plate collision, uplift, and erosion interact over millions of years", "Single cause", "Not understood"], correct: 1 },
        { id: 5, question: "How do volcanic eruptions affect geography?", options: ["Minimal", "Create new land, alter climate, destroy ecosystems, release minerals", "Only local", "No effect"], correct: 1 },
        { id: 6, question: "What is soil formation and why does it matter?", options: ["Not relevant", "Weathering of rock, organic matter accumulation; critical for agriculture, carbon storage", "Just dirt", "No process"], correct: 1 },
        { id: 7, question: "How do coastlines change through erosion and deposition?", options: ["Static", "Wave action, currents, sea level shifts create cliffs, beaches, spits dynamically", "Never change", "No process"], correct: 1 }
      ],
      // Human Geography Lesson 63 Worksheet 2: Atmosphere & Climate Patterns
      "Atmosphere & Climate Patterns": [
        { id: 1, question: "What drives atmospheric circulation patterns?", options: ["Random winds", "Differential solar heating, Coriolis effect, pressure gradients create trade winds, jets", "No pattern", "Irregular"], correct: 1 },
        { id: 2, question: "How do ocean currents influence climate?", options: ["No effect", "Transport heat poleward, moderate temperatures, influence precipitation patterns globally", "Negligible", "Local only"], correct: 1 },
        { id: 3, question: "What causes monsoon patterns?", options: ["Not understood", "Seasonal pressure shifts cause reversal of wind direction and major precipitation", "Random weather", "No cause"], correct: 1 },
        { id: 4, question: "How do greenhouse gases alter atmospheric energy balance?", options: ["No effect", "Trap outgoing radiation increasing temperature; carbon cycle altered anthropogenically", "Minimal warming", "Disputed"], correct: 1 },
        { id: 5, question: "What is the relationship between altitude and climate?", options: ["No relationship", "Temperature drops, precipitation varies, creating distinct ecological zones", "Same everywhere", "Random"], correct: 1 },
        { id: 6, question: "How do El Niño and La Niña affect global weather?", options: ["Localized", "Ocean temperature anomalies trigger rainfall, drought patterns worldwide", "Not significant", "Temporary"], correct: 1 },
        { id: 7, question: "What are feedback mechanisms in climate systems?", options: ["Not present", "Ice-albedo, water vapor, cloud feedbacks amplify or dampen warming", "No coupling", "Independent"], correct: 1 }
      ],
      // Human Geography Lesson 64 Worksheet 2: Hydrosphere & Water Systems
      "Hydrosphere & Water Systems": [
        { id: 1, question: "How is freshwater distributed globally?", options: ["Evenly", "97% saltwater, freshwater in ice caps, groundwater; accessible fraction tiny", "Unlimited", "Unknown"], correct: 1 },
        { id: 2, question: "What is water stress and its geographic pattern?", options: ["Not real", "Demand exceeds sustainable supply in arid regions, causing conflict, migration", "No stress", "Equal everywhere"], correct: 1 },
        { id: 3, question: "How do aquifers recharge and how fast?", options: ["Instantly", "Precipitation infiltrates slowly; recharge rates vary; overpumping depletes reserves", "Rapidly", "Not finite"], correct: 1 },
        { id: 4, question: "What causes groundwater contamination?", options: ["Natural", "Industrial waste, agricultural runoff, sewage leaching; persistent in aquifers", "Temporary", "Self-cleaning"], correct: 1 },
        { id: 5, question: "How do watersheds organize water systems?", options: ["Arbitrary", "Natural drainage basins directing precipitation to rivers, groundwater; management units", "No organization", "Random"], correct: 1 },
        { id: 6, question: "What are impacts of dam construction?", options: ["Only benefits", "Hydropower, flood control but ecosystem disruption, sediment trapping, migration", "No downsides", "Temporary"], correct: 1 },
        { id: 7, question: "How does water scarcity relate to development?", options: ["Unrelated", "Limits agriculture, industry, health; drives migration, conflict, tech innovation", "No connection", "Not critical"], correct: 1 }
      ],
      // Human Geography Lesson 65 Worksheet 2: Biogeography & Ecosystems
      "Biogeography & Ecosystems": [
        { id: 1, question: "What determines species distribution patterns?", options: ["Random", "Climate, topography, soils, historical dispersal, human activity shape ranges", "Not explained", "Universal"], correct: 1 },
        { id: 2, question: "How do biodiversity hotspots form?", options: ["Randomly", "Distinct geology, climate, historical isolation create endemic species concentration", "Everywhere equal", "No causes"], correct: 1 },
        { id: 3, question: "What is biome classification based on?", options: ["Arbitrary", "Climate (temperature, precipitation) and resulting vegetation patterns", "Only geography", "No patterns"], correct: 1 },
        { id: 4, question: "How do invasive species alter ecosystems?", options: ["Beneficial", "Outcompete natives, reduce biodiversity, disrupt food webs, economic impact", "No change", "Temporary"], correct: 1 },
        { id: 5, question: "What role do keystone species play?", options: ["Minor", "Disproportionate impact on ecosystem structure; removal cascades through food web", "Not special", "No effect"], correct: 1 },
        { id: 6, question: "How does habitat fragmentation affect species?", options: ["No effect", "Isolates populations, reduces gene flow, increases extinction risk", "Beneficial", "Not real"], correct: 1 },
        { id: 7, question: "What is the relationship between humans and ecosystems?", options: ["Separate", "Humans reshape ecosystems profoundly; land use, pollution, climate change alter biodiversity", "No impact", "Natural"], correct: 1 }
      ],
      // Human Geography Lesson 66 Worksheet 2: Population & Human Migration
      "Population & Human Migration": [
        { id: 1, question: "What drives demographic transitions in populations?", options: ["Not understood", "Economic development lowers fertility and mortality; societies move through stages", "Random change", "No pattern"], correct: 1 },
        { id: 2, question: "Why do migration patterns vary by development level?", options: ["No variation", "Poor: rural-urban, forced; middle: regional; rich: internal, selective", "Same everywhere", "Not explained"], correct: 1 },
        { id: 3, question: "What are push and pull factors in migration?", options: ["No factors", "Push: poverty, conflict; pull: jobs, safety, education; complex interactions", "Single reason", "Unimportant"], correct: 1 },
        { id: 4, question: "How does urbanization affect societies?", options: ["Neutral", "Concentration creates efficiency, innovation, but inequality, congestion, strain", "Only benefits", "Not significant"], correct: 1 },
        { id: 5, question: "What are consequences of aging populations?", options: ["No effect", "Healthcare costs, labor shortage, pension strain, political power shifts", "Not real", "Temporary"], correct: 1 },
        { id: 6, question: "How do refugees differ from migrants?", options: ["No difference", "Refugees flee persecution, violence; migrants seek opportunity; legal, rights differ", "Same status", "Not distinct"], correct: 1 },
        { id: 7, question: "What is population momentum?", options: ["Not real", "Young age structure continues growth despite lower fertility; births lag decline", "Stops immediately", "No lag"], correct: 1 }
      ],
      // Human Geography Lesson 67 Worksheet 2: Culture & Society
      "Culture & Society": [
        { id: 1, question: "How does culture shape geographic patterns?", options: ["No influence", "Language, religion, ethnicity cluster spatially; influence economy, politics, conflict", "Minor role", "Not relevant"], correct: 1 },
        { id: 2, question: "What is cultural diffusion and how does it occur?", options: ["No diffusion", "Ideas, practices spread through trade, migration, media; not uniform adoption", "Instant", "No barriers"], correct: 1 },
        { id: 3, question: "How do religions create distinctive places?", options: ["No impact", "Sacred sites, pilgrimage, architecture, food, calendar shape landscapes", "Only beliefs", "No geography"], correct: 1 },
        { id: 4, question: "What role does language in geographic identity?", options: ["Minor", "Defines region, maintains culture, shapes worldview, political boundaries", "Unimportant", "No connection"], correct: 1 },
        { id: 5, question: "How does globalization affect local cultures?", options: ["No effect", "Homogenization of consumption, media; loss of languages, practices; resistance movements", "Protective", "Not real"], correct: 1 },
        { id: 6, question: "What creates ethnic geographic concentrations?", options: ["Random", "Migration chains, discrimination, preference, economic opportunity clustering", "Even distribution", "No reason"], correct: 1 },
        { id: 7, question: "How do gender roles vary geographically?", options: ["Identical everywhere", "Economic structure, religion, colonialism, development stage create variation", "No patterns", "Not significant"], correct: 1 }
      ],
      // Human Geography Lesson 68 Worksheet 2: Political Geography & Borders
      "Political Geography & Borders": [
        { id: 1, question: "How are borders established and maintained?", options: ["Naturally fixed", "Treaties, war, colonialism, rivers; contested, redrawn, demilitarized or fortified", "Permanent", "No change"], correct: 1 },
        { id: 2, question: "What creates geopolitical conflict?", options: ["Random", "Resources, territory, ideology, historical grievance, proxy wars, great power competition", "No reason", "Unpredictable"], correct: 1 },
        { id: 3, question: "How do nation-states differ from empires?", options: ["No difference", "Nation-states: bounded sovereignty, nationalism; empires: territorial expansion, domination", "Same thing", "Not relevant"], correct: 1 },
        { id: 4, question: "What is sovereignty and why is it contested?", options: ["Absolute", "State authority challenged by subnational groups, supra-national bodies, corporations", "Never questioned", "Not real"], correct: 1 },
        { id: 5, question: "How do international organizations affect geopolitics?", options: ["No effect", "UN, NATO, ASEAN mediate conflicts, enforce norms, reallocate power", "Powerless", "Limited"], correct: 1 },
        { id: 6, question: "What are buffer states and why do they exist?", options: ["Random", "Located between rivals; prevent direct conflict; independence threatened", "Meaningless", "Not real"], correct: 1 },
        { id: 7, question: "How do territorial disputes arise?", options: ["Rare", "Overlapping claims, colonial borders, resources, historical precedent, nationalism", "Uncommon", "Not serious"], correct: 1 }
      ],
      // Human Geography Lesson 69 Worksheet 2: Economic Geography & Development
      "Economic Geography & Development": [
        { id: 1, question: "What creates global economic inequality?", options: ["Not real", "Colonial history, resource curse, geography, trade structures, capital mobility asymmetries", "Natural", "Not caused"], correct: 1 },
        { id: 2, question: "How have value chains globalized?", options: ["Not changed", "Production fragmented across countries; location driven by labor costs, skills, infrastructure", "Centralized", "Unchanged"], correct: 1 },
        { id: 3, question: "What is comparative advantage in trade?", options: ["No advantage", "Countries specialize in lowest-opportunity-cost production; enables mutually beneficial exchange", "All same", "Not real"], correct: 1 },
        { id: 4, question: "How does geography affect agricultural production?", options: ["No effect", "Climate, soil, topography, seasonality determine crops, yields, vulnerability", "Irrelevant", "Overcome"], correct: 1 },
        { id: 5, question: "What drives industrial location decisions?", options: ["Random", "Labor, transport costs, materials, agglomeration, infrastructure, incentives", "No factors", "Arbitrary"], correct: 1 },
        { id: 6, question: "How do extractive industries shape regions?", options: ["Beneficial", "Wealth concentration, environmental damage, labor exploitation, boom-bust cycles", "Only good", "No impact"], correct: 1 },
        { id: 7, question: "What is development and how is it measured?", options: ["Only GDP", "Economic growth, but includes health, education, inequality, sustainability indicators vary", "Single metric", "Agreed upon"], correct: 1 }
      ],
      // Human Geography Lesson 70 Worksheet 2: Urban Systems & Cities
      "Urban Systems & Cities": [
        { id: 1, question: "What determines city hierarchy and rank-size distributions?", options: ["Random", "Market size, connectivity, history create pyramids (many small) or primacy (one large)", "Uniform", "No pattern"], correct: 1 },
        { id: 2, question: "How do cities organize internal space?", options: ["No pattern", "Land use: CBD, residential, industrial; distance, cost, zoning influence location", "Chaotic", "Not organized"], correct: 1 },
        { id: 3, question: "What drives urban sprawl?", options: ["Efficient", "Cheap land, car dependence, zoning separation, subsidies, preference expansion", "Planned", "Not real"], correct: 1 },
        { id: 4, question: "How are informal settlements formed?", options: ["Intentional", "Rural migration, poverty, inadequate housing, land occupation, weak governance", "Planned", "No cause"], correct: 1 },
        { id: 5, question: "What are smart cities and their goals?", options: ["No purpose", "Technology integration for efficiency, sustainability, quality of life; data-driven management", "Meaningless", "Limited"], correct: 1 },
        { id: 6, question: "How does gentrification reshape neighborhoods?", options: ["Beneficial for all", "Investment, displacement, cultural change, rising costs, inequality concentration", "No change", "Only positive"], correct: 1 },
        { id: 7, question: "What challenges do megacities face?", options: ["None", "Congestion, pollution, service access, inequality, disaster vulnerability, sprawl", "All solved", "Not serious"], correct: 1 }
      ],
      // Psychology Lesson 71 Worksheet 2: Research Methods & Experimental Design
      "Research Methods & Experimental Design": [
        { id: 1, question: "What is the difference between correlation and causation?", options: ["Same thing", "Correlation: variables change together; causation: one causes other; correlation insufficient", "No difference", "Not important"], correct: 1 },
        { id: 2, question: "What are confounding variables and their danger?", options: ["Helpful", "Uncontrolled factors affecting results; create false conclusions about relationships", "Necessary", "No problem"], correct: 1 },
        { id: 3, question: "How does random assignment reduce bias?", options: ["Doesn't", "Distributes confounds equally; enables attribution of effects to manipulation", "Increases bias", "No effect"], correct: 1 },
        { id: 4, question: "What is the placebo effect and why does it occur?", options: ["Not real", "Belief causes physiological response; expectancy activates brain mechanisms", "Just psychology", "Only fake"], correct: 1 },
        { id: 5, question: "What is ecological validity and its importance?", options: ["Not relevant", "Lab findings generalize to real world; artificial settings limit applicability", "Always valid", "Not concerned"], correct: 1 },
        { id: 6, question: "How do longitudinal studies differ from cross-sectional?", options: ["No difference", "Longitudinal: follow same people over time; cross-sectional: snapshot comparison", "Same design", "Not distinct"], correct: 1 },
        { id: 7, question: "What ethical principles guide psychological research?", options: ["Anything allowed", "Informed consent, right to withdraw, confidentiality, minimize harm, debriefing", "No rules", "Not needed"], correct: 1 }
      ],
      // Psychology Lesson 72 Worksheet 2: Sensation & Perception
      "Sensation & Perception": [
        { id: 1, question: "What is the just-noticeable difference and what determines it?", options: ["Not real", "Minimum change detected; determined by Weber's law based on stimulus intensity", "Constant", "Individual"], correct: 1 },
        { id: 2, question: "How does attention filter sensory information?", options: ["Doesn't", "Selective attention focuses on relevant stimuli; cocktail party effect demonstrates", "No filtering", "All equal"], correct: 1 },
        { id: 3, question: "What are depth cues and how do they work?", options: ["Not used", "Binocular (disparity), monocular (perspective, texture); brain reconstructs 3D from 2D images", "Only one type", "Not real"], correct: 1 },
        { id: 4, question: "What is perceptual constancy and why is it adaptive?", options: ["Not real", "Objects appear same despite changing sensory input; enables object recognition in varied contexts", "Changes constantly", "No purpose"], correct: 1 },
        { id: 5, question: "How do expectations shape perception?", options: ["No effect", "Top-down processing: prior knowledge influences interpretation of ambiguous stimuli", "Not involved", "Separate"], correct: 1 },
        { id: 6, question: "What is synesthesia and what does it reveal?", options: ["Not real", "Sensory cross-activation: stimulation of one sense triggers another; shows sensory interconnection", "Psychological", "Unimportant"], correct: 1 },
        { id: 7, question: "How do sensory thresholds relate to awareness?", options: ["Not related", "Absolute threshold: minimum intensity detected; below threshold: subliminal (debated effects)", "No distinction", "Same thing"], correct: 1 }
      ],
      // Psychology Lesson 73 Worksheet 2: Sleep, Dreams & Altered States
      "Sleep, Dreams & Altered States": [
        { id: 1, question: "What are the stages of sleep and their functions?", options: ["All same", "NREM1-3 (increasingly deep), REM (vivid dreams); consolidate memories, restore physiology", "Identical", "Not distinct"], correct: 1 },
        { id: 2, question: "What is sleep deprivation and its consequences?", options: ["Harmless", "Impairs cognition, immunity, emotion; chronic increases disease risk, mortality", "No effect", "Temporary"], correct: 1 },
        { id: 3, question: "What are theories of dream function?", options: ["Meaningless", "Activation-synthesis: brain interprets neural noise; emotional regulation; memory consolidation", "No theories", "Just stories"], correct: 1 },
        { id: 4, question: "What is hypnosis and does it work?", options: ["Fake", "Altered state of focused attention; effective for pain, habit change; not mind control", "Complete control", "Not real"], correct: 1 },
        { id: 5, question: "What are effects of psychoactive drugs?", options: ["Only bad", "Alter neurotransmission; effects vary by type; dependence, tolerance, withdrawal possible", "Always beneficial", "No effect"], correct: 1 },
        { id: 6, question: "What distinguishes meditation from other altered states?", options: ["No difference", "Self-induced, focused attention or mindfulness; reduces stress, alters brain activity", "Same as sleep", "Not unique"], correct: 1 },
        { id: 7, question: "How does consciousness relate to brain activity?", options: ["Unrelated", "Brain areas activate during awareness; anesthesia blocks activity; coma = absent consciousness", "No connection", "Brain not involved"], correct: 1 }
      ],
      // Psychology Lesson 74 Worksheet 2: Developmental Psychology
      "Developmental Psychology": [
        { id: 1, question: "How do nature and nurture interact in development?", options: ["Only nature", "Both essential; genes provide potential, environment shapes expression (epigenetics)", "Only nurture", "Separate"], correct: 1 },
        { id: 2, question: "What did Piaget's stages reveal about cognition?", options: ["Not accurate", "Children think qualitatively differently; progress through stages (sensorimotor to formal operations)", "All same", "No development"], correct: 1 },
        { id: 3, question: "What is attachment and why does it matter?", options: ["Not important", "Early bond with caregiver affects emotion regulation, relationships, security; separation distress", "Irrelevant", "No effect"], correct: 1 },
        { id: 4, question: "How do parenting styles affect child development?", options: ["No effect", "Authoritative (warm, firm) promotes competence; authoritarian/permissive different outcomes", "All equal", "Not involved"], correct: 1 },
        { id: 5, question: "What is temperament and how stable is it?", options: ["Not real", "Inborn behavioral tendencies; relatively stable but shaped by environment", "Entirely learned", "Changes daily"], correct: 1 },
        { id: 6, question: "What challenges do adolescents face?", options: ["None", "Identity formation, peer pressure, brain development, increased depression/risk; seek autonomy", "All manageable", "No changes"], correct: 1 },
        { id: 7, question: "How does cognitive development continue in adulthood?", options: ["Stops in childhood", "Crystallized intelligence increases; fluid may decline; wisdom develops; neural plasticity remains", "All decline", "No growth"], correct: 1 }
      ],
      // Psychology Lesson 75 Worksheet 2: Learning & Classical Conditioning
      "Learning & Classical Conditioning": [
        { id: 1, question: "What is the difference between unconditioned and conditioned responses?", options: ["No difference", "Unconditioned: innate reaction; conditioned: learned response to neutral stimulus", "Same thing", "Not distinct"], correct: 1 },
        { id: 2, question: "What happens during extinction and reconditioning?", options: ["Permanent", "Extinction: CS loses effect; reconditioning: relearning is faster; memories not erased", "Disappears forever", "No difference"], correct: 1 },
        { id: 3, question: "What is stimulus generalization and discrimination?", options: ["Not real", "Generalization: respond to similar stimuli; discrimination: distinguish differences", "Same process", "Not learned"], correct: 1 },
        { id: 4, question: "What is operant conditioning's basic principle?", options: ["Not real", "Behavior followed by consequence; reinforcement increases frequency, punishment decreases", "No pattern", "Random effects"], correct: 1 },
        { id: 5, question: "What is the difference between positive and negative reinforcement?", options: ["No difference", "Positive: add reward; negative: remove aversive; both increase behavior", "Same thing", "Opposite effects"], correct: 1 },
        { id: 6, question: "What is a fixed versus variable schedule?", options: ["No difference", "Fixed: predictable pattern; variable: unpredictable; variable produces stronger learning", "Same strength", "Not relevant"], correct: 1 },
        { id: 7, question: "What are limitations of behaviorism?", options: ["None", "Ignores cognition, emotions, free will; works better for simple than complex behavior", "Complete", "No limits"], correct: 1 }
      ],
      // Psychology Lesson 76 Worksheet 2: Memory & Information Processing
      "Memory & Information Processing": [
        { id: 1, question: "What are the stages of the information processing model?", options: ["Not real", "Encoding: registration; storage: retention; retrieval: access; each subject to failures", "No stages", "Simultaneous"], correct: 1 },
        { id: 2, question: "What is the capacity and duration of working memory?", options: ["Unlimited", "About 7±2 items; 20-30 seconds without rehearsal; central to cognition", "Very large", "Permanent"], correct: 1 },
        { id: 3, question: "What is long-term potentiation and why matters?", options: ["Not real", "Synaptic strengthening with repeated stimulation; mechanism underlying learning and memory", "No role", "Theoretical"], correct: 1 },
        { id: 4, question: "What is retroactive interference?", options: ["Doesn't occur", "New learning impairs memory of similar older material; demonstrates memory competition", "Not real", "No effect"], correct: 1 },
        { id: 5, question: "What is the spacing effect?", options: ["No effect", "Distributed practice produces better retention than massed; timing of review matters", "Doesn't matter", "Irrelevant"], correct: 1 },
        { id: 6, question: "What causes false memories?", options: ["Never occurs", "Misleading suggestions, imagination, source confusion; memories reconstructed, not recorded", "Always accurate", "Not possible"], correct: 1 },
        { id: 7, question: "What is the serial position effect?", options: ["Not real", "Recall primacy (first items) and recency (last items); middle items worst remembered", "No pattern", "Random"], correct: 1 }
      ],
      // Psychology Lesson 77 Worksheet 2: Cognition, Language & Intelligence
      "Cognition, Language & Intelligence": [
        { id: 1, question: "What is the relationship between language and thought?", options: ["No relationship", "Sapir-Whorf hypothesis: language may influence perception; bidirectional relationship", "Language determined", "Unrelated"], correct: 1 },
        { id: 2, question: "What are heuristics and when do they fail?", options: ["Never fail", "Mental shortcuts enabling quick decisions; cause biases (availability, anchoring, confirmation)", "Always wrong", "No problems"], correct: 1 },
        { id: 3, question: "What is metacognition and why is it important?", options: ["Not real", "Thinking about thinking; monitoring understanding; essential for learning and problem-solving", "Not needed", "No value"], correct: 1 },
        { id: 4, question: "What does the Dunning-Kruger effect describe?", options: ["Not real", "Unskilled overestimate ability; experts recognize complexity; inflated confidence correlates with low ability", "Only applies to experts", "Not proven"], correct: 1 },
        { id: 5, question: "What is intelligence and how is it measured?", options: ["Single ability", "Multiple abilities (cognitive, emotional, creative); IQ measures mostly academic/verbal skills", "Only one type", "Unchangeable"], correct: 1 },
        { id: 6, question: "What are heritability and the nature-nurture debate?", options: ["Entirely genetic", "Intelligence ~50% heritability; environment critical; gene-environment interaction complex", "Only environment", "Disproven"], correct: 1 },
        { id: 7, question: "What causes intelligence differences across groups?", options: ["Genetic", "Socioeconomic status, education quality, stereotype threat, test bias, environmental factors", "All genetic", "Unknown"], correct: 1 }
      ],
      // Psychology Lesson 78 Worksheet 2: Emotion & Motivation
      "Emotion & Motivation": [
        { id: 1, question: "What are components of emotion?", options: ["Only feeling", "Physiological arousal, subjective experience, behavioral expression; integrated processes", "Single system", "Not connected"], correct: 1 },
        { id: 2, question: "How do sympathetic and parasympathetic nervous systems differ?", options: ["No difference", "Sympathetic: fight-or-flight arousal; parasympathetic: rest-and-digest; oppose each other", "Same system", "Not distinct"], correct: 1 },
        { id: 3, question: "What is the role of the amygdala in emotions?", options: ["Not involved", "Detects emotionally significant stimuli, especially threats; activates fear response rapidly", "Rational processing", "No role"], correct: 1 },
        { id: 4, question: "What is Maslow's hierarchy of needs?", options: ["Not real", "Pyramid: physiological, safety, belonging, esteem, self-actualization; criticized as oversimplified", "Proven", "Scientifically accurate"], correct: 1 },
        { id: 5, question: "What is intrinsic versus extrinsic motivation?", options: ["No difference", "Intrinsic: internal drive; extrinsic: external reward; intrinsic may undermine with rewards", "Same thing", "Not distinct"], correct: 1 },
        { id: 6, question: "What causes emotional regulation failures?", options: ["Never fails", "Stress, exhaustion, emotional intensity, limited strategies, avoidant coping", "Always works", "No failures"], correct: 1 },
        { id: 7, question: "How does culture influence emotional expression?", options: ["No influence", "Display rules vary; intensity, appropriateness, meaning differ; universal and cultural aspects", "Irrelevant", "All same"], correct: 1 }
      ],
      // Psychology Lesson 79 Worksheet 2: Personality & Psychological Disorders Part 1
      "Personality & Psychological Disorders Part 1": [
        { id: 1, question: "What are the Big Five personality traits?", options: ["Not valid", "Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism; relatively stable across life", "Not measured", "Arbitrary"], correct: 1 },
        { id: 2, question: "What is personality stability and change?", options: ["Static", "Core traits stable but behavior changes with context; genetic and environmental influences", "Always changing", "No consistency"], correct: 1 },
        { id: 3, question: "What defines a psychological disorder?", options: ["Just sadness", "Distress, dysfunction, deviance, danger; must cause significant impairment", "Medical only", "Not defined"], correct: 1 },
        { id: 4, question: "What is the diathesis-stress model?", options: ["Not real", "Predisposition + environmental stress triggers disorder; explains individual differences", "Just genetics", "Only environment"], correct: 1 },
        { id: 5, question: "What causes anxiety disorders?", options: ["Only trauma", "Genetic predisposition, brain chemistry, learning history, stress, cognitions interact", "Not biological", "Unknown"], correct: 1 },
        { id: 6, question: "What is the difference between sadness and major depression?", options: ["No difference", "Depression: persistent, pervasive dysfunction, symptoms 2+ weeks; sadness is normal emotion", "Same thing", "Just severity"], correct: 1 },
        { id: 7, question: "What are biological treatments for disorders?", options: ["No effect", "Medication (antidepressants, antipsychotics), brain stimulation, surgery; variable effectiveness", "Always work", "Unnecessary"], correct: 1 }
      ],
      // Psychology Lesson 80 Worksheet 2: Psychological Disorders Part 2 & Social Psychology
      "Psychological Disorders Part 2 & Social Psychology": [
        { id: 1, question: "What causes schizophrenia and its symptoms?", options: ["Just trauma", "Dopamine dysregulation, genetic risk; delusions, hallucinations, disorganization prominent", "Only genetic", "Not biological"], correct: 1 },
        { id: 2, question: "What are dissociative disorders and their causes?", options: ["Not real", "Memory, identity, consciousness disruption; often linked to trauma; debated mechanisms", "Malingering", "No causes"], correct: 1 },
        { id: 3, question: "What makes conformity and obedience important social phenomena?", options: ["Rare", "Pervasive influence on behavior; Asch, Milgram showed people override own judgment", "Never happen", "Not studied"], correct: 1 },
        { id: 4, question: "What is cognitive dissonance and how is it resolved?", options: ["Not real", "Conflict between attitudes/behavior; resolved by changing attitude, behavior, or adding beliefs", "Never occurs", "Ignored"], correct: 1 },
        { id: 5, question: "What causes prejudice and stereotyping?", options: ["Not learned", "Social categorization, in-group bias, cognitive shortcuts, competition, socialization", "Entirely genetic", "Not studied"], correct: 1 },
        { id: 6, question: "What is the bystander effect and why does it happen?", options: ["Not real", "Group presence reduces helping; diffusion of responsibility, social inhibition", "Always help", "Disproven"], correct: 1 },
        { id: 7, question: "What is attribution bias and its consequences?", options: ["Not real", "Fundamental attribution error (overestimate personality, underestimate situation); affects judgment", "Accurate", "No bias"], correct: 1 }
      ],
    };

    if (!secondSheetMap[lessonTitle]) {
      return Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        question: `Advanced question ${i + 1} about "${lessonTitle}"`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0
      }));
    }

    return secondSheetMap[lessonTitle];
  };

  const worksheet2Questions = createSecondWorksheet(lessonVideos, currentLesson?.title || "");

  const user = JSON.parse(localStorage.getItem("user")) || null;

  // Timeline steps for Lesson 1
  const timelineSteps = [
    { id: 1, title: "Watch 5 Videos", completed: Object.keys(watchedVideos).length === 5, current: Object.keys(watchedVideos).length < 5 },
    { id: 2, title: "Book a Tutor", completed: !!bookedSession, current: Object.keys(watchedVideos).length === 5 && !bookedSession },
    { id: 3, title: "Do 2 Worksheets", completed: step3Completed, current: !!bookedSession && !step3Completed },
    { id: 4, title: "Q&A Post", completed: step4Completed, current: step3Completed && !step4Completed },
    { id: 5, title: "Complete Game", completed: step5Completed, current: step4Completed && !step5Completed },
    { id: 6, title: "Finish Lesson", completed: step6Completed, current: step5Completed && !step6Completed },
  ];

  console.log("📊 Timeline state - activeStep:", activeStep, "step4Completed:", step4Completed, "Step 5 clickable:", step4Completed || activeStep === 5);
  console.log("🎮 Step 5 state - should display?:", activeStep === 5, "activeStep value:", activeStep);
  console.log("🔍 RENDER CHECK - activeStep === 5?", activeStep === 5, "| activeStep:", activeStep, "| step4Completed:", step4Completed, "| step5Completed:", step5Completed);

  useEffect(() => {
    if (!lesson) {
      navigate("/");
      return;
    }

    // Mock tutors data for testing
    const mockTutors = [
      {
        id: 101,
        name: "Dr. Sarah Mitchell",
        bio: "Expert in Biology with 10+ years of teaching experience. Specializes in cellular biology and genetics.",
      },
      {
        id: 102,
        name: "Prof. James Chen",
        bio: "Passionate educator with a focus on interactive learning. Great at breaking down complex concepts.",
      },
    ];

    // Mock sessions data for testing - One hour apart, 9 AM to 5 PM daily
    const mockSessions = [];
    const startDate = new Date(2026, 0, 8); // Jan 8, 2026
    const endDate = new Date(2026, 0, 21);  // Jan 21, 2026
    const sessionHours = [9, 10, 11, 12, 13, 14, 15, 16, 17]; // 9 AM to 5 PM, one hour apart

    const dates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    
    let sessionId = 1;
    dates.forEach((dateObj) => {
      sessionHours.forEach((hour) => {
        const tutorIdIndex = sessionId % 2;
        const tutorId = tutorIdIndex === 0 ? 101 : 102; // Alternate tutors
        mockSessions.push({
          id: sessionId,
          tutor_id: tutorId,
          session_time: new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), hour, 0).toISOString(),
          max_spots: 5,
          signed_up_count: Math.floor(Math.random() * 3), // 0-2 people signed up
          meetLink: "https://meet.google.com/kgc-xqnu-dym", // Google Meet link for all sessions
        });
        sessionId += 1;
      });
    })

    async function loadLessonDetails() {
      try {
        // Fetch tutors
        const tRes = await fetch(`http://localhost:8080/lessons/${lessonId}/tutors`);
        if (tRes.ok) {
          const tData = await tRes.json();
          setTutors(tData.tutors && tData.tutors.length > 0 ? tData.tutors : mockTutors);
        } else {
          setTutors(mockTutors);
        }

        // Fetch sessions
        const sRes = await fetch(`http://localhost:8080/lessons/${lessonId}/sessions`);
        if (sRes.ok) {
          const sData = await sRes.json();
          const normalized = (sData.sessions || []).map((ss) => ({
            ...ss,
            spots_left: ss.max_spots - (ss.signed_up_count || ss.signed_up || 0),
          }));
          setSessions(normalized.length > 0 ? normalized : mockSessions.map(s => ({
            ...s,
            spots_left: s.max_spots - s.signed_up_count,
          })));
        } else {
          setSessions(mockSessions.map(s => ({
            ...s,
            spots_left: s.max_spots - s.signed_up_count,
          })));
        }
      } catch (err) {
        console.error("Failed to load lesson details, using mock data:", err);
        setTutors(mockTutors);
        setSessions(mockSessions.map(s => ({
          ...s,
          spots_left: s.max_spots - s.signed_up_count,
        })));
      }
    }

    loadLessonDetails();
  }, [lessonId, currentLesson, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch video progress and lesson progress from database
  useEffect(() => {
    // Backend API disabled - using localStorage instead
    console.log("✅ Backend API disabled - using localStorage for progress tracking");
  }, [user, currentLesson]);

  // Load worksheet state from localStorage on mount
  useEffect(() => {
    if (currentLesson && currentLesson.id) {
      const worksheetKey = `lesson_${currentLesson.id}_worksheets`;
      const savedState = localStorage.getItem(worksheetKey);
      
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          console.log("📥 Loaded worksheet state from localStorage:", parsed);
          
          if (parsed.worksheet1Submitted) {
            setWorksheet1Submitted(true);
            if (parsed.worksheet1Answers) {
              setWorksheet1Answers(parsed.worksheet1Answers);
            }
          }
          
          if (parsed.worksheet2Submitted) {
            setWorksheet2Submitted(true);
            if (parsed.worksheet2Answers) {
              setWorksheet2Answers(parsed.worksheet2Answers);
            }
          }
          
          if (parsed.step3Completed) {
            setStep3Completed(true);
          }
          
          if (parsed.step4Completed) {
            setStep4Completed(true);
          }
          
          if (parsed.step5Completed) {
            setStep5Completed(true);
          }
          
          if (parsed.step6Completed) {
            setStep6Completed(true);
          }
        } catch (err) {
          console.error("❌ Error loading worksheet state:", err);
        }
      }
    }
  }, [currentLesson]);

  // Load booked session from localStorage on mount
  useEffect(() => {
    if (currentLesson && currentLesson.id && user && user.id) {
      const bookedSessionKey = `lesson_${currentLesson.id}_${currentLesson.title}_user_${user.id}_bookedSession`;
      const savedSession = localStorage.getItem(bookedSessionKey);
      
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          console.log("📥 Loaded booked session from localStorage:", parsed);
          setBookedSession(parsed);
        } catch (err) {
          console.error("❌ Error loading booked session:", err);
        }
      }
    }
  }, [currentLesson, user]);

  // Load watched videos from localStorage on component mount
  useEffect(() => {
    if (currentLesson && currentLesson.id && user && user.id) {
      try {
        const watched = getWatchedVideos(user.id, currentLesson.id);
        if (watched && Object.keys(watched).length > 0) {
          console.log("📥 Loaded watched videos from localStorage:", watched);
          setWatchedVideos(watched);
        } else {
          console.log("⏭️ No watched videos found in localStorage for this lesson");
        }
      } catch (err) {
        console.error("❌ Error loading watched videos from localStorage:", err);
      }
    }
  }, [currentLesson, user]);

  // Save worksheet state to localStorage whenever it changes
  useEffect(() => {
    if (currentLesson && currentLesson.id && (worksheet1Submitted || worksheet2Submitted || step3Completed || step4Completed || step5Completed || step6Completed)) {
      const worksheetKey = `lesson_${currentLesson.id}_worksheets`;
      const stateToSave = {
        worksheet1Submitted,
        worksheet1Answers,
        worksheet2Submitted,
        worksheet2Answers,
        step3Completed,
        step4Completed,
        step5Completed,
        step6Completed,
        savedAt: new Date().toISOString(),
      };
      
      localStorage.setItem(worksheetKey, JSON.stringify(stateToSave));
      console.log("💾 Saved worksheet state to localStorage:", stateToSave);
      
      // Notify dashboard of updates
      window.dispatchEvent(new CustomEvent("dashboardStorageChange"));
    }
  }, [worksheet1Submitted, worksheet2Submitted, step3Completed, step4Completed, step5Completed, step6Completed, worksheet1Answers, worksheet2Answers, currentLesson]);

  // Save booked session to localStorage whenever it changes
  useEffect(() => {
    if (lesson && lesson.id && user && user.id && bookedSession) {
      const bookedSessionKey = `lesson_${lesson.id}_${lesson.title}_user_${user.id}_bookedSession`;
      const stateToSave = {
        ...bookedSession,
        savedAt: new Date().toISOString(),
      };
      
      localStorage.setItem(bookedSessionKey, JSON.stringify(stateToSave));
      console.log("💾 Saved booked session to localStorage:", stateToSave);
    }
  }, [bookedSession, lesson, user]);

  // Trigger celebration when steps are completed
  // (Currently unused - celebration removed in favor of timeline progress visualization)
  // useEffect(() => {
  //   if (step3Completed || step4Completed || step5Completed) {
  //     triggerCelebration();
  //   }
  // }, [step3Completed, step4Completed, step5Completed]);

  // Auto-navigate to next incomplete step when worksheets are completed
  useEffect(() => {
    if (step3Completed && activeStep < 4 && !step4Completed) {
      transitionToStep(4);
    } else if (step4Completed && activeStep < 5 && !step5Completed) {
      transitionToStep(5);
    } else if (step5Completed && activeStep < 6 && !step6Completed) {
      transitionToStep(6);
    }
  }, [step3Completed, step4Completed, step5Completed, step6Completed, activeStep]);

  // Log activeStep changes for debugging
  useEffect(() => {
    console.log("🎯 activeStep changed to:", activeStep);
  }, [activeStep]);

  // Scroll to Step 5 when it becomes active
  useEffect(() => {
    if (activeStep === 5) {
      console.log("🎮 Step 5 is now active, attempting to scroll into view");
      setTimeout(() => {
        const step5Section = document.querySelector('.step-five-section');
        if (step5Section) {
          step5Section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          console.log("✅ Scrolled Step 5 into view");
        } else {
          console.log("⚠️ Step 5 section not found in DOM, checking lesson-content-grid");
          const contentGrid = document.querySelector('.lesson-content-grid');
          if (contentGrid) {
            contentGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log("✅ Scrolled lesson-content-grid into view");
          }
        }
      }, 100);
    }
  }, [activeStep]);

  // Award XP when lesson is completed
  useEffect(() => {
    if (step5Completed && !lessonXPAwarded && user && user.id) {
      const XP_REWARD = 50;
      
      // Update user XP in localStorage
      const updatedUser = { ...user, coins: (user.coins || 0) + XP_REWARD };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Send XP award to backend
      fetch(`http://localhost:8080/lessons/${lesson.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          xp_earned: XP_REWARD,
        }),
      }).catch(err => console.error("❌ Error saving XP reward:", err));
      
      // Dispatch dashboard update event
      const activity = {
        id: Date.now(),
        type: "Lesson Completed",
        description: `Finished ${lesson.title}`,
        subject: lesson.title,
        created_at: new Date(),
      };

      window.dispatchEvent(new CustomEvent("dashboardUpdate", {
        detail: {
          type: "lessonCompleted",
          activity,
          stats: { 
            xp: (user?.xp || 0) + XP_REWARD,
            lessonsCompleted: (user?.lessonsCompleted || 0) + 1
          }
        }
      }));
      
      setLessonXPAwarded(true);
      console.log(`✅ Awarded ${XP_REWARD} XP for completing lesson`);
    }
  }, [step5Completed, lessonXPAwarded, user, lesson]);
  function markVideoWatched(videoId) {
    console.log("🎬 markVideoWatched called for video ID:", videoId);
    setWatchedVideos((prev) => ({
      ...prev,
      [videoId]: true,
    }));
    setCurrentVideoPlayer(null);

    // Save video progress to localStorage
    console.log("👤 User:", user);
    console.log("📚 Lesson:", lesson);
    
    if (user && user.id && lesson && lesson.id) {
      // Save to localStorage using the imported function with subject name
      const success = saveVideoToStorage(user.id, lesson.id, videoId, {
        title: currentVideoPlayer?.title || `Video ${videoId}`,
        subject: lesson?.title || "Unknown Subject",
        watchedAt: new Date().toISOString()
      });
      
      if (success) {
        console.log(`✅ Video ${videoId} progress saved to localStorage for lesson ${lesson.id} - Subject: ${lesson?.title}`);
        // Notify dashboard of video watched
        window.dispatchEvent(new CustomEvent("dashboardStorageChange"));
      } else {
        console.error(`❌ Failed to save video progress to localStorage`);
      }
      
      // Award XP and coins for watching video
      addXP(user.id, 10);
      addCoins(user.id, 5);
      
      // Mark intro as completed if this is lesson 1 (Cell Structure) and video 1
      if (lesson.id === 1 && videoId === 1) {
        markIntroVideoCompleted(user.id);
        console.log("🎓 Intro video marked as completed!");
      }
    } else {
      console.warn("⚠️ Cannot save video progress: Missing user or lesson data");
    }
  }

  function openVideoPlayer(video) {
    setCurrentVideoPlayer(video);
  }

  function handlePostQuestion() {
    console.log("🔥 handlePostQuestion called, newQuestion:", newQuestion);
    if (newQuestion.trim()) {
      // Get stored questions
      let storedQuestions = [];
      try {
        const stored = localStorage.getItem("scihub_qna_questions");
        storedQuestions = stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error("Error reading from localStorage:", error);
      }
      
      // Create new question in Q&A format
      const newStoredQuestion = {
        id: Math.max(...storedQuestions.map(q => q.id), 0) + 1,
        title: "Lesson Q&A Question",
        body: newQuestion,
        author: user?.firstName || "Anonymous",
        authorId: user?.id || 0,
        timestamp: new Date().toISOString(),
        views: 0,
        replies: [],
      };
      
      // Add to stored questions and save
      const updated = [newStoredQuestion, ...storedQuestions];
      try {
        localStorage.setItem("scihub_qna_questions", JSON.stringify(updated));
        console.log("✅ Question saved to localStorage:", updated.length, "questions");
      } catch (error) {
        console.error("❌ Error saving question to localStorage:", error);
      }
      
      // Update local state
      const newPost = {
        id: newStoredQuestion.id,
        author: user?.firstName || "Anonymous",
        type: "question",
        content: newQuestion,
        timestamp: "just now",
        replies: 0,
        likes: 0,
        title: "Lesson Q&A Question",
        answers: [],
      };
      setCommunityPosts([newPost, ...communityPosts]);
      setNewQuestion("");
      setIsTransitioning(true);
      setStep4Completed(true);
      const lessonProgress = {
        lessonId: currentLesson?.id,
        step3Completed: step3Completed,
        step4Completed: true,
        step5Completed: step5Completed,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(`lesson_${currentLesson?.id}_progress`, JSON.stringify(lessonProgress));
      console.log("✅ Step 4 completed and saved to localStorage");
      setBookingStatus({ type: "success", message: "Your question has been posted!" });
      setTimeout(() => {
        setActiveStep(5);
        setIsTransitioning(false);
      }, 600);
      setTimeout(() => setBookingStatus(null), 3000);
    } else {
      console.log("⚠️ Question is empty, not posting");
    }
  }

  function handlePostAnswer() {
    console.log("🔥 handlePostAnswer called, newAnswer:", newAnswer);
    if (newAnswer.trim()) {
      // Get stored questions
      let storedQuestions = [];
      try {
        const stored = localStorage.getItem("scihub_qna_questions");
        storedQuestions = stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error("Error reading from localStorage:", error);
      }
      
      // Create new answer and add to first question (or create a helper question)
      if (storedQuestions.length > 0) {
        const reply = {
          id: (storedQuestions[0].replies?.length || 0) + 1,
          body: newAnswer,
          author: user?.firstName || "Anonymous",
          authorId: user?.id || 0,
          timestamp: new Date().toISOString(),
          upvotes: 0,
        };
        storedQuestions[0].replies = [...(storedQuestions[0].replies || []), reply];
        try {
          localStorage.setItem("scihub_qna_questions", JSON.stringify(storedQuestions));
          console.log("✅ Answer saved to localStorage");
        } catch (error) {
          console.error("❌ Error saving answer to localStorage:", error);
        }
      }
      
      // Update local state
      const newPost = {
        id: communityPosts.length + 1,
        author: user?.firstName || "Anonymous",
        type: "answer",
        content: newAnswer,
        timestamp: "just now",
        replies: 0,
        likes: 0,
      };
      setCommunityPosts([newPost, ...communityPosts]);
      setNewAnswer("");
      setIsTransitioning(true);
      setStep4Completed(true);
      const lessonProgress = {
        lessonId: currentLesson?.id,
        step3Completed: step3Completed,
        step4Completed: true,
        step5Completed: step5Completed,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(`lesson_${currentLesson?.id}_progress`, JSON.stringify(lessonProgress));
      console.log("✅ Step 4 completed and saved to localStorage");
      setBookingStatus({ type: "success", message: "Your answer has been posted!" });
      setTimeout(() => {
        setActiveStep(5);
        setIsTransitioning(false);
      }, 600);
      setTimeout(() => setBookingStatus(null), 3000);
    } else {
      console.log("⚠️ Answer is empty, not posting");
    }
  }

  function handleLikePost(postId) {
    setCommunityPosts(prev => 
      prev.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  }

  function closeVideoPlayer() {
    setCurrentVideoPlayer(null);
  }

  // Transition to next step with animation
  function transitionToStep(nextStepId) {
    setStepTransitionAnimating(true);
    
    // Brief animation delay before switching
    setTimeout(() => {
      setActiveStep(nextStepId);
      setStepTransitionAnimating(false);
    }, 400);
  }

  function handleStepClick(stepId) {
    // Only allow clicking on completed steps or the current step (sequential unlock)
    const step = timelineSteps.find(s => s.id === stepId);
    console.log("🖱️ Step clicked:", stepId);
    console.log("  Step object:", step);
    console.log("  Completed?:", step?.completed);
    console.log("  Current?:", step?.current);
    console.log("  Clickable:", step && (step.completed || step.current));
    
    // Special handling for Step 5: allow clicking if Step 4 is completed
    if (stepId === 5 && step4Completed) {
      console.log("✅ Step 5 allowed (step4Completed is true)");
      transitionToStep(stepId);
      return;
    }
    
    if (step && (step.completed || step.current)) {
      console.log("✅ Setting activeStep to:", stepId);
      transitionToStep(stepId);
    } else {
      console.log("❌ Step is not clickable yet. Completed:", step?.completed, "Current:", step?.current);
    }
  }

  // Calendar helper functions
  function getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  function getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }

  function hasSessionOnDate(date) {
    if (!selectedTutor) return false;
    const tutorSess = sessions.filter(s => s.tutor_id === selectedTutor.id || s.tutorId === selectedTutor.id);
    return tutorSess.some(session => {
      const sessionDate = new Date(session.session_time);
      return sessionDate.getDate() === date.getDate() &&
             sessionDate.getMonth() === date.getMonth() &&
             sessionDate.getFullYear() === date.getFullYear();
    });
  }

  function getSessionsForDate(date) {
    if (!selectedTutor) return [];
    const tutorSess = sessions.filter(s => s.tutor_id === selectedTutor.id || s.tutorId === selectedTutor.id);
    return tutorSess.filter(session => {
      const sessionDate = new Date(session.session_time);
      return sessionDate.getDate() === date.getDate() &&
             sessionDate.getMonth() === date.getMonth() &&
             sessionDate.getFullYear() === date.getFullYear();
    });
  }

  async function handleSignupToSession(session) {
    if (!user) {
      alert("Please log in to book a session");
      return;
    }

    if (session.spots_left === 0) {
      setBookingStatus({ type: "error", message: "This session is full" });
      return;
    }

    setSignupProcessing(true);
    try {
      // Try API first
      const res = await fetch(`http://localhost:8080/sessions/${session.id}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          name: user.firstName || "Student",
          email: user.email,
        }),
      });

      let bookingSuccess = false;
      let bookedSessionData = null;
      
      if (res.ok) {
        const data = await res.json();
        bookedSessionData = data.session || session;
        setBookedSession(bookedSessionData);
        bookingSuccess = true;
      } else {
        // If API fails, use mock booking (for testing)
        bookedSessionData = session;
        setBookedSession(bookedSessionData);
        bookingSuccess = true;
      }

      if (bookingSuccess) {
        // Save to localStorage with all necessary info
        bookTutoringSession(user.id, {
          tutorId: selectedTutor?.id,
          tutorName: selectedTutor?.name,
          subject: lesson?.title || "Biology",
          date: new Date(session.session_time).toLocaleDateString(),
          time: new Date(session.session_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          sessionTime: session.session_time,
          meetLink: session.meetLink || "https://meet.google.com/kgc-xqnu-dym",
        });

        // Log activity
        logActivity(user.id, {
          type: "Tutoring",
          description: `Booked session with ${selectedTutor?.name}`,
          subject: lesson?.title || "Biology",
        });

        // Check for achievement unlocks
        const newlyUnlocked = checkAndUnlockAchievements(user.id);
        if (newlyUnlocked.length > 0) {
          console.log(`🏆 ${newlyUnlocked.length} achievement(s) unlocked!`);
        }

        setBookingStatus({ type: "success", message: "Session booked successfully!" });
        setSessions((prev) =>
          prev.map((p) =>
            p.id === session.id ? { ...p, spots_left: Math.max(0, (p.spots_left || 0) - 1) } : p
          )
        );
        
        setTimeout(() => setBookingStatus(null), 3000);
      }
    } catch (err) {
      console.error("Booking error:", err);
      // Still allow mock booking on error
      setBookedSession(session);
      
      // Save to localStorage even on API error
      bookTutoringSession(user.id, {
        tutorId: selectedTutor?.id,
        tutorName: selectedTutor?.name,
        subject: lesson?.title || "Biology",
        date: new Date(session.session_time).toLocaleDateString(),
        time: new Date(session.session_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        sessionTime: session.session_time,
        meetLink: session.meetLink || "https://meet.google.com/kgc-xqnu-dym",
      });

      logActivity(user.id, {
        type: "Tutoring",
        description: `Booked session with ${selectedTutor?.name}`,
        subject: lesson?.title || "Biology",
      });

      // Check for achievement unlocks
      const newlyUnlocked = checkAndUnlockAchievements(user.id);
      if (newlyUnlocked.length > 0) {
        console.log(`🏆 ${newlyUnlocked.length} achievement(s) unlocked!`);
      }

      setBookingStatus({ type: "success", message: "Session booked successfully!" });
      setSessions((prev) =>
        prev.map((p) =>
          p.id === session.id ? { ...p, spots_left: Math.max(0, (p.spots_left || 0) - 1) } : p
        )
      );
      setTimeout(() => setBookingStatus(null), 3000);
    } finally {
      setSignupProcessing(false);
    }
  }

  return (
    <div className="dashboard-page">
      <Sidebar />
      {/* Video Player Modal - OUTSIDE main to escape scroll context */}
      {currentVideoPlayer && (
        <div className="video-player-modal">
          <div className="video-player-backdrop" onClick={closeVideoPlayer} />
          <div className="video-player-container">
            <button className="video-player-close" onClick={closeVideoPlayer}>✕</button>
            <div className="video-player-content">
              <h2>{currentVideoPlayer.title}</h2>
              <div className="video-source-attribution" style={{textAlign: 'center', fontSize: '0.85rem', color: '#888', marginBottom: '1rem'}}>
                Source: <a href="https://www.youtube.com/@crashcourse" target="_blank" rel="noopener noreferrer" style={{color: '#4f46e5', textDecoration: 'none'}}>CrashCourse</a>
              </div>
              <div className="video-player-iframe">
                <iframe
                  width="100%"
                  height="100%"
                  src={currentVideoPlayer.url.includes('embed') ? `${currentVideoPlayer.url}?autoplay=1` : `https://www.youtube.com/embed/${currentVideoPlayer.url.split('v=')[1].split('&')[0]}?autoplay=1`}
                  title={currentVideoPlayer.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="video-player-actions">
                <button 
                  className="mark-complete-btn"
                  onClick={() => {
                    markVideoWatched(currentVideoPlayer.id);
                  }}
                >
                  ✓ Mark Complete & Close
                </button>
                <button 
                  className="video-close-btn"
                  onClick={closeVideoPlayer}
                >
                  Close Without Marking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <main className="dashboard-main lesson-main">

        {/* Back button */}
        <button className="back-btn" onClick={() => {
          const path = getBackNavigationPath();
          console.log("🔙 Back button clicked, navigating to:", path);
          navigate(path, { replace: true });
        }}>
          ← Back
        </button>

        {/* Header */}
        <header className="lesson-header" style={{
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(0, 240, 255, 0.1) 100%)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          borderRadius: "20px",
          padding: "3rem",
          position: "relative",
          overflow: "hidden",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 60px rgba(99, 102, 241, 0.15)",
          marginBottom: "3rem"
        }}>
          {/* Background gradient accent */}
          <div style={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.2), transparent)",
            borderRadius: "50%",
            pointerEvents: "none"
          }}></div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem" }}>
              <div style={{ flex: 1 }}>
                {/* Lesson Badge */}
                <div style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(0, 240, 255, 0.2))",
                  border: "1px solid rgba(99, 102, 241, 0.4)",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  fontSize: "0.85rem",
                  color: "#7dd3fc",
                  fontWeight: "700",
                  marginBottom: "1.5rem",
                  backdropFilter: "blur(10px)"
                }}>
                  📚 LESSON {lesson.lesson_number}
                </div>

                {/* Title */}
                <h1 style={{
                  fontSize: "2.8rem",
                  fontWeight: "800",
                  margin: "0 0 0.75rem 0",
                  color: "#f5f7ff",
                  background: "linear-gradient(135deg, #00f0ff 0%, #7dd3fc 50%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  {lesson.title}
                </h1>

                {/* Subtitle */}
                <p style={{
                  fontSize: "1.05rem",
                  color: "#d1d5db",
                  margin: "0",
                  lineHeight: "1.6",
                  maxWidth: "600px"
                }}>
                  Master the concepts and skills in this lesson with guided lessons and tutor support.
                </p>

                {/* Source Attribution */}
                <p style={{
                  fontSize: "0.9rem",
                  color: "#a3e635",
                  margin: "1rem 0 0 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  📹 Videos from <a href="https://www.youtube.com/@crashcourse" target="_blank" rel="noopener noreferrer" style={{color: '#4ade80', textDecoration: 'underline'}}>CrashCourse</a>
                </p>
              </div>

              {/* Quick Stats Card */}
              <div style={{
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(0, 240, 255, 0.15))",
                border: "1px solid rgba(99, 102, 241, 0.4)",
                borderRadius: "16px",
                padding: "2rem",
                minWidth: "220px",
                textAlign: "center",
                backdropFilter: "blur(10px)"
              }}>
                <div style={{
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  background: "linear-gradient(135deg, #00f0ff, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  margin: "0 0 0.75rem 0"
                }}>
                  {lesson.videos?.length || 5}
                </div>
                <div style={{
                  fontSize: "0.9rem",
                  color: "#d1d5db",
                  fontWeight: "600"
                }}>
                  Videos to Learn
                </div>
                <div style={{
                  marginTop: "1.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid rgba(99, 102, 241, 0.2)"
                }}>
                  <div style={{
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    color: "#86efac",
                    marginBottom: "0.25rem"
                  }}>
                    +50 XP
                  </div>
                  <div style={{
                    fontSize: "0.8rem",
                    color: "#9ca3af"
                  }}>
                    Lesson Reward
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* XP Bar */}
        <div style={{
          background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)",
          border: "1px solid rgba(34, 197, 94, 0.2)",
          borderRadius: "12px",
          padding: "1.2rem",
          marginBottom: "1.5rem",
          backdropFilter: "blur(10px)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ color: "#9ca3af", fontSize: "0.9rem", fontWeight: "600" }}>📊 Lesson Reward</div>
            <div style={{ color: "#86efac", fontSize: "1rem", fontWeight: "700" }}>+50 XP</div>
          </div>
          <div style={{ background: "rgba(0, 0, 0, 0.2)", borderRadius: "8px", height: "10px", overflow: "hidden" }}>
            <div style={{
              width: `${(Object.keys(watchedVideos).length / 5) * 25 + (bookedSession ? 25 : 0) + (step3Completed ? 25 : 0) + (step4Completed ? 12.5 : 0) + (step5Completed ? 12.5 : 0)}%`,
              height: "100%",
              background: "linear-gradient(90deg, #86efac, #22c55e)",
              transition: "width 0.3s ease",
            }}></div>
          </div>
          <div style={{ color: "#6b7280", fontSize: "0.8rem", marginTop: "0.5rem" }}>
            {step5Completed ? "✅ Lesson Complete! XP Awarded" : "Complete all steps to earn 50 XP"}
          </div>
        </div>

        {/* Go to Games Button - Always Available */}
        <div style={{
          background: "linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)",
          border: "1px solid rgba(168, 85, 247, 0.3)",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "2rem",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem"
        }}>
          <div>
            <div style={{ color: "#d8b4fe", fontSize: "1rem", fontWeight: "700", marginBottom: "0.25rem" }}>🎮 Ready for Games?</div>
            <div style={{ color: "#9ca3af", fontSize: "0.85rem" }}>Test your knowledge with interactive games and earn bonus rewards!</div>
          </div>
          <button
            onClick={() => navigate("/games", { replace: false })}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              border: "2px solid rgba(168, 85, 247, 0.5)",
              background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(139, 92, 246, 0.1))",
              color: "#e9d5ff",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
              fontSize: "0.95rem"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(139, 92, 246, 0.2))";
              e.target.style.borderColor = "rgba(168, 85, 247, 0.8)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(139, 92, 246, 0.1))";
              e.target.style.borderColor = "rgba(168, 85, 247, 0.5)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Go to Games →
          </button>
        </div>

        {/* Timeline Progress for All Lessons */}
        <div className="lesson-timeline">
          <h3 className="timeline-title">Lesson Progress</h3>
          <div className="timeline-container">
            {timelineSteps.map((step, index) => {
              const isClickable = step.completed || step.current; // Only allow clicking completed or current steps (sequential unlock)
              return (
                <div 
                  key={step.id} 
                  className="timeline-item"
                  onClick={() => handleStepClick(step.id)}
                  style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
                >
                  <div className={`timeline-step ${step.completed ? "completed" : step.current ? "current" : "pending"}`}>
                    {step.completed ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <div className="timeline-label">{step.title}</div>
                  {index < timelineSteps.length - 1 && <div className="timeline-connector" />}
                </div>
              );
            })}
          </div>
          {/* Spaceship transition animation */}
          {isTransitioning && (
            <div className="spaceship-animation" style={{
              left: `${(activeStep / timelineSteps.length) * 100 - 5}%`
            }}>
              🚀
            </div>
          )}
        </div>

        {/* Booking status */}
        {bookingStatus && (
          <div className={`booking-alert booking-${bookingStatus.type}`}>
            {bookingStatus.message}
          </div>
        )}

        {/* Main content grid */}
        <div className={`lesson-content-grid ${isTransitioning ? 'transitioning' : ''}`}>
          {/* Watch Videos Section (Step 1) - Show only when activeStep === 1 */}
          {activeStep === 1 && (
            <section className={`lesson-section step-one-section ${stepTransitionAnimating ? 'step-transitioning' : ''}`}>
              <div className="step-header-modern step-one-header">
                <div className="step-header-content">
                  <div className="step-badge-modern">Step 1 of 5</div>
                  <h2 className="step-title-modern">🎥 Watch the Videos</h2>
                  <p className="step-description-modern">Watch all 5 videos to master the key concepts. Each video introduces important topics you'll need for the lesson.</p>
                </div>
                <div className="step-header-accent"></div>
              </div>
              
              <div className="videos-container">
                {lessonVideos.map((video) => (
                  <div key={video.id} className={`video-card ${watchedVideos[video.id] ? "watched" : ""}`} onClick={() => openVideoPlayer(video)} style={{ cursor: 'pointer' }}>
                    <div className="video-number">{video.id}</div>
                    <div className="video-content">
                      <h3>{video.title}</h3>
                      <p className="video-status">
                        {watchedVideos[video.id] ? "✓ Completed - Click to review" : `Video ${video.id} of 5`}
                      </p>
                    </div>
                    {!watchedVideos[video.id] ? (
                      <button 
                        className="video-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openVideoPlayer(video);
                        }}
                      >
                        Watch →
                      </button>
                    ) : (
                      <div className="video-completed">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tutors & Booking Section (Step 2) - Show only when activeStep === 2 */}
          {activeStep === 2 && (
            <section className={`lesson-section tutors-section ${stepTransitionAnimating ? 'step-transitioning' : ''}`}>
            <div className="step-header-modern step-two-header">
              <div className="step-header-content">
                <div className="step-badge-modern">Step 2 of 5</div>
                <h2 className="step-title-modern">👨‍🏫 Book a Tutor</h2>
                <p className="step-description-modern">Connect with an expert tutor who can guide you through challenging concepts and answer your questions.</p>
              </div>
              <div className="step-header-accent"></div>
            </div>
            
            {bookedSession && (
              <div className="booked-confirmation">
                <h3>✓ Session Booked!</h3>
                <p className="booked-tutor">Tutor: {selectedTutor?.name}</p>
                <p className="booked-time">{new Date(bookedSession.session_time).toLocaleString()}</p>
              </div>
            )}

            {tutors.length === 0 ? (
              <p className="muted">Loading tutors...</p>
            ) : (
              <div className="step2-layout">
                {/* Tutors Selection - Top */}
                <div className="tutors-selection-step2">
                  <h3>Select a Tutor</h3>
                  <div className="tutors-row">
                    {tutors.map((tutor) => {
                      const isSelected = selectedTutor?.id === tutor.id;

                      return (
                        <div
                          key={tutor.id}
                          className={`tutor-card-step2 ${isSelected ? "selected" : ""}`}
                          onClick={() => setSelectedTutor(isSelected ? null : tutor)}
                        >
                          <div className="tutor-avatar-step2">{tutor.name.charAt(0).toUpperCase()}</div>
                          <h4>{tutor.name}</h4>
                          <p className="tutor-bio-step2">{tutor.bio || "Expert tutor"}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mini Calendar - Bottom */}
                {selectedTutor && (
                  <div className="calendar-section-step2">
                    <div className="mini-calendar-container">
                      <div className="mini-calendar-header">
                        <button 
                          className="mini-calendar-nav"
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        >
                          ◀
                        </button>
                        <h4>{currentMonth.toLocaleString('default', { month: 'short', year: 'numeric' })}</h4>
                        <button 
                          className="mini-calendar-nav"
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        >
                          ▶
                        </button>
                      </div>

                      <div className="mini-weekdays">
                        <div>S</div>
                        <div>M</div>
                        <div>T</div>
                        <div>W</div>
                        <div>T</div>
                        <div>F</div>
                        <div>S</div>
                      </div>

                      <div className="mini-days">
                        {Array(getFirstDayOfMonth(currentMonth)).fill(null).map((_, i) => (
                          <div key={`empty-${i}`} className="mini-day empty"></div>
                        ))}
                        {Array(getDaysInMonth(currentMonth)).fill(null).map((_, i) => {
                          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
                          const hasSession = hasSessionOnDate(date);
                          const isToday = date.toDateString() === new Date().toDateString();
                          const isSelected = selectedDate?.toDateString() === date.toDateString();

                          return (
                            <div
                              key={i + 1}
                              className={`mini-day ${hasSession ? "has-session" : ""} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                              onClick={() => hasSession && setSelectedDate(isSelected ? null : date)}
                              style={{ cursor: hasSession ? 'pointer' : 'default' }}
                            >
                              {i + 1}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selected Date Sessions */}
                    {selectedDate && (
                      <div className="selected-date-sessions">
                        <h4>{selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
                        {getSessionsForDate(selectedDate).length === 0 ? (
                          <p className="muted">No available sessions on this date.</p>
                        ) : (
                          <div className="time-slots">
                            {getSessionsForDate(selectedDate).map((session) => (
                              <div key={session.id} className="time-slot">
                                <div className="slot-time">
                                  {new Date(session.session_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                </div>
                                <div className="slot-info">
                                  <span className="slot-spots">
                                    {session.spots_left > 0 ? `${session.spots_left} spot${session.spots_left > 1 ? 's' : ''}` : "Full"}
                                  </span>
                                </div>
                                <button
                                  className="slot-book-btn"
                                  disabled={signupProcessing || session.spots_left === 0 || (bookedSession && bookedSession.id === session.id)}
                                  onClick={() => {
                                    handleSignupToSession(session);
                                  }}
                                >
                                  {signupProcessing && bookedSession?.id === session.id ? "Booking..." : (bookedSession && bookedSession.id === session.id) ? "Booked ✓" : session.spots_left === 0 ? "Full" : "Book"}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            </section>
          )}

          {/* Worksheets Section (Step 3) - Show only when activeStep === 3 and tutoring session booked */}
          {activeStep === 3 && bookedSession && (
            <section className={`lesson-section step-three-section ${stepTransitionAnimating ? 'step-transitioning' : ''}`}>
              <div className="step-header-modern step-three-header">
                <div className="step-header-content">
                  <div className="step-badge-modern">Step 3 of 5</div>
                  <h2 className="step-title-modern">📝 Complete Worksheets</h2>
                  <p className="step-description-modern">Test your understanding with 2 worksheets. Answer all questions correctly to solidify your knowledge.</p>
                </div>
                <div className="step-header-accent"></div>
              </div>
              
              <div className="worksheets-container">
                {/* Worksheet 1 */}
                <div className="worksheet-card">
                  <div className="worksheet-number">Worksheet 1</div>
                
                  <p className="worksheet-description">Videos 1, 2 & 3 - 7 Questions</p>
                  <div className="worksheet-questions">
                    {worksheet1Questions.map((q) => (
                      <div key={q.id} className="question">
                        <p><strong>Q{q.id}:</strong> {q.question}</p>
                        <div className="options">
                          {q.options.map((option, idx) => (
                            <label key={idx} className="option-label">
                              <input
                                type="radio"
                                name={`worksheet1-q${q.id}`}
                                value={idx}
                                checked={worksheet1Answers[q.id] === idx}
                                onChange={(e) => setWorksheet1Answers({...worksheet1Answers, [q.id]: parseInt(e.target.value)})}
                                disabled={worksheet1Submitted}
                              />
                              <span className={worksheet1Submitted && idx === q.correct ? "correct-answer" : worksheet1Submitted && worksheet1Answers[q.id] === idx && idx !== q.correct ? "wrong-answer" : ""}>{option}</span>
                            </label>
                          ))}
                        </div>
                        {worksheet1Submitted && worksheet1Answers[q.id] !== q.correct && (
                          <div className="feedback">
                            <p className="wrong">✗ Incorrect</p>
                            <p className="correct-answer-text">Correct answer: {q.options[q.correct]}</p>
                          </div>
                        )}
                        {worksheet1Submitted && worksheet1Answers[q.id] === q.correct && (
                          <div className="feedback">
                            <p className="correct">✓ Correct!</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button 
                    className="worksheet-submit-btn" 
                    onClick={() => {
                      setWorksheet1Submitted(true);
                      if (worksheet2Submitted) setStep3Completed(true);
                      // Save worksheet progress to localStorage
                      const worksheetKey = `lesson_${currentLesson?.id}_worksheets`;
                      const stateToSave = {
                        worksheet1Submitted: true,
                        worksheet1Answers: worksheet1Answers,
                        worksheet2Submitted: worksheet2Submitted,
                        worksheet2Answers: worksheet2Answers,
                        step3Completed: worksheet2Submitted ? true : false,
                        lastUpdated: new Date().toISOString()
                      };
                      localStorage.setItem(worksheetKey, JSON.stringify(stateToSave));
                      console.log("✅ Worksheet 1 submitted and saved to localStorage");
                      // Award XP and coins for worksheet submission
                      if (user && user.id) {
                        addXP(user.id, 15);
                        addCoins(user.id, 10);
                      }
                      // Notify dashboard of worksheet submission
                      window.dispatchEvent(new CustomEvent("dashboardStorageChange"));
                    }}
                    disabled={worksheet1Submitted || Object.keys(worksheet1Answers).length < 7}
                  >
                    {worksheet1Submitted ? "Worksheet 1 Submitted" : "Submit Worksheet 1"}
                  </button>
                </div>

                {/* Worksheet 2 */}
                <div className="worksheet-card">
                  <div className="worksheet-number">Worksheet 2</div>
                  <p className="worksheet-description">Videos 4 & 5 - 7 Questions</p>
                  <div className="worksheet-questions">
                    {worksheet2Questions.map((q) => (
                      <div key={q.id} className="question">
                        <p><strong>Q{q.id}:</strong> {q.question}</p>
                        <div className="options">
                          {q.options.map((option, idx) => (
                            <label key={idx} className="option-label">
                              <input
                                type="radio"
                                name={`worksheet2-q${q.id}`}
                                value={idx}
                                checked={worksheet2Answers[q.id] === idx}
                                onChange={(e) => setWorksheet2Answers({...worksheet2Answers, [q.id]: parseInt(e.target.value)})}
                                disabled={worksheet2Submitted}
                              />
                              <span className={worksheet2Submitted && idx === q.correct ? "correct-answer" : worksheet2Submitted && worksheet2Answers[q.id] === idx && idx !== q.correct ? "wrong-answer" : ""}>{option}</span>
                            </label>
                          ))}
                        </div>
                        {worksheet2Submitted && worksheet2Answers[q.id] !== q.correct && (
                          <div className="feedback">
                            <p className="wrong">✗ Incorrect</p>
                            <p className="correct-answer-text">Correct answer: {q.options[q.correct]}</p>
                          </div>
                        )}
                        {worksheet2Submitted && worksheet2Answers[q.id] === q.correct && (
                          <div className="feedback">
                            <p className="correct">✓ Correct!</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button 
                    className="worksheet-submit-btn" 
                    onClick={() => {
                      setWorksheet2Submitted(true);
                      if (worksheet1Submitted) setStep3Completed(true);
                      // Save worksheet progress to localStorage
                      const worksheetKey = `lesson_${currentLesson?.id}_worksheets`;
                      const stateToSave = {
                        worksheet1Submitted: worksheet1Submitted,
                        worksheet1Answers: worksheet1Answers,
                        worksheet2Submitted: true,
                        worksheet2Answers: worksheet2Answers,
                        step3Completed: worksheet1Submitted ? true : false,
                        lastUpdated: new Date().toISOString()
                      };
                      localStorage.setItem(worksheetKey, JSON.stringify(stateToSave));
                      console.log("✅ Worksheet 2 submitted and saved to localStorage");
                      // Award XP and coins for worksheet submission
                      if (user && user.id) {
                        addXP(user.id, 15);
                        addCoins(user.id, 10);
                      }
                      // Notify dashboard of worksheet submission
                      window.dispatchEvent(new CustomEvent("dashboardStorageChange"));
                    }}
                    disabled={worksheet2Submitted || Object.keys(worksheet2Answers).length < 7}
                  >
                    {worksheet2Submitted ? "Worksheet 2 Submitted" : "Submit Worksheet 2"}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Q&A Post Section (Step 4) - Show only when activeStep === 4 and worksheets completed */}
          {activeStep === 4 && step3Completed && (
            <section className={`lesson-section step-four-section ${stepTransitionAnimating ? 'step-transitioning' : ''}`}>
              {/* Modern Step Header */}
              <div className="step-header-modern step-four-header">
                <div className="step-header-content">
                  <div className="step-badge-modern">Step 4 of 5</div>
                  <h2 className="step-title-modern">💬 Share Your Knowledge</h2>
                  <p className="step-description-modern">Engage with the community by asking questions or sharing insights. Your contributions help others learn and deepen your own understanding.</p>
                </div>
                <div className="step-header-accent"></div>
              </div>
              
              {/* Progress indicator */}
              {!step4Completed && (
                <div className="qa-progress-badge">
                  <div className="progress-badge-content">
                    <span className="badge-icon">✨</span>
                    <div>
                      <h4>Complete This Step</h4>
                      <p>Post a question or answer to unlock the final step (Games) and earn XP!</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="qa-container">
                <div className="qa-card qa-card-question">
                  <div className="qa-card-icon">❓</div>
                  <h3>Ask a Question</h3>
                  <p className="qa-subtitle">Share what you're curious about</p>
                  <textarea 
                    placeholder="Write your question here... Be specific and clear about what you'd like to know." 
                    className="qa-textarea"
                    rows="5"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  ></textarea>
                  <button className="qa-submit-btn" onClick={handlePostQuestion} disabled={!newQuestion.trim()}>Post Question</button>
                </div>

                <div className="qa-card qa-card-answer">
                  <div className="qa-card-icon">💡</div>
                  <h3>Share an Answer</h3>
                  <p className="qa-subtitle">Help the community learn</p>
                  <textarea 
                    placeholder="Write your answer here... Provide clear explanations and examples." 
                    className="qa-textarea"
                    rows="5"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                  ></textarea>
                  <button className="qa-submit-btn" onClick={handlePostAnswer} disabled={!newAnswer.trim()}>Post Answer</button>
                </div>
              </div>

              <div className="qa-discussion">
                <h3>Community Discussion</h3>
                <p className="qa-subtitle">Active questions and answers from the community:</p>
                <div className="discussion-posts">
                  {communityPosts.map((post) => (
                    <div key={post.id} className="post">
                      <div className="post-header">
                        <div>
                          <h4>{post.title}</h4>
                          <span className="post-author">Asked by {post.author}</span>
                        </div>
                        <span className="post-time">{post.timestamp}</span>
                      </div>
                      <p className="post-content">{post.content}</p>
                      
                      {/* Show answers if available */}
                      {post.answers && post.answers.length > 0 && (
                        <div className="post-answers">
                          <p className="answers-label">💡 {post.answers.length} Answer{post.answers.length !== 1 ? 's' : ''}:</p>
                          {post.answers.map((answer) => (
                            <div key={answer.id} className="answer-item">
                              <p className="answer-content">{answer.content}</p>
                              <div className="answer-footer">
                                <span className="answer-author">{answer.author}</span>
                                <span className="answer-time">{answer.timestamp}</span>
                                <span className="answer-likes">👍 {answer.likes}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="post-actions">
                        <button className="like-btn" onClick={() => handleLikePost(post.id)}>👍 {post.likes} Like{post.likes !== 1 ? 's' : ''}</button>
                        <button className="reply-btn" onClick={() => console.log("Reply to question", post.id)}>💬 Reply</button>
                        <span className="post-stat">👁️ {post.views || 100} views</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Games Section (Step 5) - Redirect to Games Page */}
          {activeStep === 5 && (
            <section className={`lesson-section step-five-section ${stepTransitionAnimating ? 'step-transitioning' : ''}`}>
            <div className="step-header-modern step-five-header">
              <div className="step-header-content">
                <div className="step-badge-modern">Step 5 of 6</div>
                <h2 className="step-title-modern">🎮 Play Games & Earn Rewards</h2>
                <p className="step-description-modern">Test your mastery with interactive games. Earn XP and rewards while having fun with the material you've learned.</p>
              </div>
              <div className="step-header-accent"></div>
            </div>
            
            <div className="games-redirect-section">
              <div className="games-redirect-card">
                <div className="games-icon">🎮</div>
                <h3>Ready to Play Games?</h3>
                <p>Complete interactive games tailored to this lesson to reinforce what you've learned and earn XP and rewards!</p>
                <div className="games-features">
                  <div className="feature-item">✨ Earn Reward Points</div>
                  <div className="feature-item">🏆 Track Your Score</div>
                  <div className="feature-item">📈 Level Up Your Skills</div>
                </div>
                <button 
                  className="games-redirect-btn"
                  onClick={() => {
                    console.log("🎮 Games button clicked!");
                    navigate("/games", { replace: false });
                  }}
                >
                  Go to Games Page →
                </button>
                <button 
                  className="step-complete-btn"
                  onClick={() => {
                    console.log("✅ Transitioning to step 6 with animation");
                    setStepTransitionAnimating(true);
                    const lessonProgress = {
                      lessonId: currentLesson?.id,
                      step3Completed: step3Completed,
                      step4Completed: step4Completed,
                      step5Completed: true,
                      lastUpdated: new Date().toISOString()
                    };
                    localStorage.setItem(`lesson_${currentLesson?.id}_progress`, JSON.stringify(lessonProgress));
                    console.log("✅ Step 5 completed and saved to localStorage");
                    // Notify dashboard of step completion
                    window.dispatchEvent(new CustomEvent("dashboardStorageChange"));
                    setTimeout(() => {
                      setActiveStep(6);
                      setStep5Completed(true);
                      setStepTransitionAnimating(false);
                    }, 400);
                  }}
                >
                  ✓ Continue to Completion
                </button>
              </div>
            </div>
          </section>
          )}

          {/* Complete Lesson Section (Step 6) - Full page transition with animation */}
          {activeStep === 6 && (
            <section className={`lesson-section step-six-section ${stepTransitionAnimating ? 'step-transitioning' : ''}`}>
            <div className="step-header-modern step-six-header">
              <div className="step-header-content">
                <div className="step-badge-modern">Step 6 of 6</div>
                <h2 className="step-title-modern">{step6Completed ? '🎉 Lesson Completed!' : '🎉 Complete the Lesson'}</h2>
                <p className="step-description-modern">{step6Completed ? 'Your lesson has been completed and saved successfully!' : 'Congratulations! You\'ve completed all steps. Click below to finalize and save your lesson completion.'}</p>
              </div>
              <div className="step-header-accent"></div>
            </div>
            
            <div className="completion-section">
              <div className="completion-card">
                <div className="completion-icon">🎉</div>
                <h3>{step6Completed ? 'Lesson Successfully Completed!' : 'Lesson Completed!'}</h3>
                <p>{step6Completed ? 'Your progress has been saved and this lesson will now appear as completed in your lesson grid. You can now view the next lesson.' : 'You\'ve successfully completed all the steps in this lesson. Your progress has been tracked and will be saved to your profile.'}</p>
                <div className="completion-benefits">
                  <div className="benefit-item">✅ Mark lesson as complete</div>
                  <div className="benefit-item">💾 Save to local storage</div>
                  <div className="benefit-item">📊 Update your profile</div>
                  <div className="benefit-item">🏅 Earn completion badge</div>
                </div>
                {!step6Completed && (
                <button 
                  className="complete-lesson-btn"
                  onClick={() => {
                    console.log("✅ Completing lesson:", currentLesson?.id);
                    console.log("📝 Setting step6Completed to true");
                    
                    // Mark step 6 as completed - this will trigger the save useEffect
                    setStep6Completed(true);
                    
                    const user = JSON.parse(localStorage.getItem("user")) || null;
                    
                    // Save lesson completion to localStorage
                    const completedLessons = JSON.parse(localStorage.getItem("completedLessons") || "[]");
                    if (!completedLessons.includes(currentLesson?.id)) {
                      completedLessons.push(currentLesson?.id);
                      localStorage.setItem("completedLessons", JSON.stringify(completedLessons));
                      console.log("✅ Lesson completion saved to localStorage:", completedLessons);
                      
                      // Call markLessonCompleted to properly update dashboard stats
                      if (user && user.id) {
                        markLessonCompleted(user.id, currentLesson?.id, {
                          title: currentLesson?.title,
                          category: currentLesson?.category
                        });
                        
                        // Award completion bonus coins and XP
                        const COMPLETION_BONUS_XP = 50;
                        const COMPLETION_BONUS_COINS = 25;
                        addXP(user.id, COMPLETION_BONUS_XP);
                        addCoins(user.id, COMPLETION_BONUS_COINS);
                        console.log(`🎉 Lesson completed! Awarded ${COMPLETION_BONUS_XP} XP and ${COMPLETION_BONUS_COINS} coins`);
                        
                        // Check for achievement unlocks
                        const newlyUnlocked = checkAndUnlockAchievements(user.id);
                        if (newlyUnlocked.length > 0) {
                          console.log(`🏆 ${newlyUnlocked.length} achievement(s) unlocked!`);
                        }
                      }
                    }
                    
                    // Save lesson completion details
                    const lessonCompletion = {
                      lessonId: currentLesson?.id,
                      title: currentLesson?.title,
                      completedAt: new Date().toISOString(),
                      step6Completed: true
                    };
                    const allCompletions = JSON.parse(localStorage.getItem("lessonCompletions") || "[]");
                    allCompletions.push(lessonCompletion);
                    localStorage.setItem("lessonCompletions", JSON.stringify(allCompletions));
                    console.log("✅ Lesson completion details saved:", lessonCompletion);
                    
                    // Also manually save worksheet state with step6Completed
                    const worksheetKey = `lesson_${currentLesson?.id}_worksheets`;
                    const currentState = JSON.parse(localStorage.getItem(worksheetKey) || "{}");
                    const stateToSave = {
                      ...currentState,
                      step6Completed: true,
                      savedAt: new Date().toISOString(),
                    };
                    localStorage.setItem(worksheetKey, JSON.stringify(stateToSave));
                    console.log("💾 Saved step6Completed to worksheet state:", stateToSave);
                    
                    // Notify dashboard of lesson completion
                    window.dispatchEvent(new CustomEvent("dashboardUpdate", {
                      detail: {
                        type: "lessonCompleted",
                        lessonId: currentLesson?.id,
                        lessonTitle: currentLesson?.title
                      }
                    }));
                    
                    // Save to user database if user is logged in
                    if (user?.id) {
                      setUserData(user.id, "lessonCompletions", allCompletions);
                      console.log("✅ Lesson completion saved to user database");
                    }
                  }}
                >
                  ✓ Complete & Save Lesson
                </button>
                )}
                {step6Completed ? (
                <button 
                  className="complete-lesson-btn"
                  onClick={() => {
                    try {
                      console.log("🎯 Return to Lesson Grid button clicked");
                      console.log("📌 Current lesson ID:", lesson?.id);
                      
                      // Get the subject page based on lesson category or subjectName from location state
                      const subjectPageMap = {
                        biology: "/biology",
                        Biology: "/biology",
                        chemistry: "/chemistry",
                        Chemistry: "/chemistry",
                        physics: "/physics",
                        Physics: "/physics",
                        environmental: "/environmental-science",
                        "Environmental Science": "/environmental-science",
                        history: "/history",
                        History: "/history",
                        economics: "/economics",
                        Economics: "/economics",
                        geography: "/human-geography",
                        "Human Geography": "/human-geography",
                        psychology: "/psychology",
                        Psychology: "/psychology",
                      };
                      
                      // Try to get from location state first, then fall back to lesson category
                      const subjectName = location.state?.subjectName || lesson?.category || "biology";
                      const subjectPage = subjectPageMap[subjectName] || "/biology";
                      
                      console.log("📚 Navigating to subject page:", subjectPage);
                      console.log("📊 Subject name:", subjectName);
                      
                      navigate(subjectPage, { replace: false });
                    } catch (error) {
                      console.error("❌ Error navigating to subject page:", error);
                      alert("Error navigating to subject page. Please try again.");
                    }
                  }}
                  style={{
                    background: "linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(16, 185, 129, 0.8) 100%)",
                    borderColor: "rgba(34, 197, 94, 1)",
                    marginTop: "0.5rem"
                  }}
                >
                  ↩️ Return to Lesson Grid
                </button>
                ) : null}
                <button 
                  className="review-work-btn"
                  onClick={() => setActiveStep(1)}
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "rgba(99, 102, 241, 0.2)",
                    border: "2px solid rgba(99, 102, 241, 0.5)",
                    color: "#6366f1",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(99, 102, 241, 0.3)";
                    e.target.style.borderColor = "rgba(99, 102, 241, 0.8)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "rgba(99, 102, 241, 0.2)";
                    e.target.style.borderColor = "rgba(99, 102, 241, 0.5)";
                  }}
                >
                  📖 Go & Review Your Work
                </button>
              </div>
            </div>
          </section>
          )}
        </div>
      </main>
    </div>
  );
}