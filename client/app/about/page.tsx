import Navbar from '@/components/Navbar'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Jumbotron */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-12 md:pb-16 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
            About
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        {/* Engineering the Future */}
        <section className="mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 border-b-2 sm:border-b-4 border-gray-900 pb-1.5 sm:pb-2">
            About PawTech: Engineering the Future of Adoption
          </h2>
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-3 sm:mb-4">
              At PawTech Inc., we believe that every shelter pet deserves a loving, permanent home. But we also know that the most successful adoptions aren't based on chance, they're based on true compatibility.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-3 sm:mb-4">
              The heartbreaking reality is that many adoptions fail due to lifestyle and personality mismatches, leading to pets being returned to already overburdened shelters. We saw this problem not as an endpoint, but as an engineering challenge. We knew there had to be a better, smarter way to forge connections that last a lifetime.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed font-semibold">
              That's why we created Furever.ai.
            </p>
          </div>
        </section>

        {/* Hero Image */}
        <div className="mb-10 sm:mb-12 md:mb-16 bg-emerald-500 rounded-lg sm:rounded-xl">
          <div 
            className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-cover bg-center rounded-lg sm:rounded-xl"
            style={{
              backgroundImage: 'url(/images/3.png)',
            }}
          />
        </div>

        {/* Our Solution */}
        <section className="mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 border-gray-900 pb-2">
            Furever.ai
          </h2>
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-3 sm:mb-4">
              Furever.ai is a revolutionary web application that serves as an intelligent matchmaker, a data-driven partner for adopters, and a powerful efficiency tool for shelters. We go beyond surface-level attraction ("that's a cute dog!") and tap into the deeper fundamentals of what makes a human-animal bond successful.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
              By harnessing the power of machine learning, we analyze personality, lifestyle, energy levels, and preferences to create perfect matches, ensuring that every adoption is a <span className="font-extrabold">furever</span> one ✨.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6  border-gray-900 pb-2">
            How It Works: The Technology of Togetherness
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-7 md:mb-8">
            Our platform is built on a sophisticated suite of six machine learning algorithms, each playing a critical role in the adoption journey.
          </p>

          {/* For Adopters */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              1. For Adopters: Finding Your Perfect Match
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-3 sm:mb-4">
              Our process begins with getting to know you.
            </p>
            
            <div className="space-y-4 sm:space-y-5 md:space-y-6 ml-3 sm:ml-4 md:ml-6">
              <div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                  The 5-Minute Pawsonality Quiz
                </h4>
               
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  Forget generic surveys. Our proprietary quiz is the first step in our deep analysis. A Decision Tree algorithm instantly analyzes your answers to classify you into one of our 8 unique "Pawsonality Types."
                </p>
              </div>

              <div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                  Intelligent Browsing
                </h4>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  Once we know you (whether you're a "Cozy Companion" or an "Active Adventurer"), you'll browse pets in an intuitive, swipe-to-match interface.
                </p>
              </div>

              <div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                  AI Compatibility Scores
                </h4>
                
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  You won't just see cute faces; you'll see real-time match percentages. Our core Support Vector Machine (SVM) calculates a compatibility score for every pet, while an advanced Artificial Neural Network (ANN) provides a "DeepMatch Score" by analyzing complex patterns from thousands of successful adoptions.
                </p>
              </div>

              <div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                  Transparent Reasoning
                </h4>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  We always show our work. You'll see why you're a 92% match with a specific pet.
                </p>
              </div>

              <div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                  Smart Suggestions
                </h4>
               
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  Found a pet you love? Our K-Nearest Neighbors (KNN) model instantly suggests similar pets, helping you discover hidden gems you might have otherwise missed.
                </p>
              </div>
            </div>
          </div>

          {/* For Shelters */}
          <div className="mb-8 sm:mb-10 md:mb-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              2. For Shelters: Smarter, Faster Adoptions
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-3 sm:mb-4">
              We are a dedicated partner to animal shelters and rescues. Our platform is designed to lighten their load and increase their success rates.
            </p>
            
            <div className="space-y-4 sm:space-y-5 md:space-y-6 ml-3 sm:ml-4 md:ml-6">
              <div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                  AI-Powered Auto-Tagging
                </h4>
                <p className="text-xs sm:text-sm text-green-600 font-semibold mb-1.5 sm:mb-2">
                  Naive Bayes: We use a Naive Bayes text classifier to automatically analyze pet descriptions and generate relevant tags like "family-friendly," "apartment-approved," or "good with kids," saving shelters countless hours of manual data entry.
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  When a shelter uploads a pet's description, our Naive Bayes algorithm instantly reads the text and auto-tags the profile with crucial traits like "family-friendly," "good with other dogs," or "apartment-approved."
                </p>
              </div>

              <div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                  Adoption Predictions
                </h4>
               
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  We use Linear Regression to analyze a pet's traits and match data, providing shelters with a "Predicted Adoption Timeline." This helps them manage resources and focus attention on animals who may need more help getting noticed.
                </p>
              </div>

              <div>
                <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                  Match Analytics
                </h4>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  We provide a comprehensive dashboard to track what local adopters are looking for and how matches are performing, empowering shelters with actionable data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pawsonality Types */}
        <section className="mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 border-gray-900 pb-2">
            Meet Our 8 Pawsonality Types
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-6 sm:mb-7 md:mb-8">
            Our proprietary assessment is the foundation of our matching system. It classifies adopters based on lifestyle, energy, and preferences to ensure we find a pet that truly fits into your life.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            <div className="border-l-2 sm:border-l-4 border-blue-600 pl-3 sm:pl-4">
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Active Adventurer</h4>
              <p className="text-sm sm:text-base text-gray-700">High energy, experienced, and needs an active pet.</p>
            </div>

            <div className="border-l-2 sm:border-l-4 border-purple-600 pl-3 sm:pl-4">
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Cozy Companion</h4>
              <p className="text-sm sm:text-base text-gray-700">Low energy, novice, perfect for a calm companion.</p>
            </div>

            <div className="border-l-2 sm:border-l-4 border-pink-600 pl-3 sm:pl-4">
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Social Butterfly</h4>
              <p className="text-sm sm:text-base text-gray-700">Very social and loves outgoing, friendly pets.</p>
            </div>

            <div className="border-l-2 sm:border-l-4 border-green-600 pl-3 sm:pl-4">
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Quiet Caretaker</h4>
              <p className="text-sm sm:text-base text-gray-700">Reserved and ideal for shy or independent pets.</p>
            </div>

            <div className="border-l-2 sm:border-l-4 border-red-600 pl-3 sm:pl-4">
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Confident Guardian</h4>
              <p className="text-sm sm:text-base text-gray-700">Experienced and well-suited for large or protective breeds.</p>
            </div>

            <div className="border-l-2 sm:border-l-4 border-yellow-600 pl-3 sm:pl-4">
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Gentle Nurturer</h4>
              <p className="text-sm sm:text-base text-gray-700">Empathetic and perfect for special needs or timid pets.</p>
            </div>

            <div className="border-l-2 sm:border-l-4 border-orange-600 pl-3 sm:pl-4">
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Playful Enthusiast</h4>
              <p className="text-sm sm:text-base text-gray-700">High energy and loves young, playful pets.</p>
            </div>

            <div className="border-l-2 sm:border-l-4 border-indigo-600 pl-3 sm:pl-4">
              <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Balanced Buddy</h4>
              <p className="text-sm sm:text-base text-gray-700">Adaptable and matches well with most average pets.</p>
            </div>
          </div>
        </section>

        {/* Our Vision */}
        <section className="mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 border-gray-900 pb-2">
            Our Vision
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-3 sm:mb-4 italic font-semibold">
            Our vision is a world where shelters are empty and homes are full.
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-3 sm:mb-4">
            By harnessing the power of data and compassionate technology, PawTech Inc. is bridging the gap between hope and home. We are committed to reducing shelter burdens, eliminating the guesswork for adopters, and creating more "welcome home" moments that last a lifetime.
          </p>
          
        </section>

        {/* Developers Section */}
        <section className="mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 border-gray-900 pb-2">
            Meet The Developers
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-5 md:mb-6">
            Furever.ai was brought to life by a passionate team of engineers and data scientists dedicated to making a difference in animal welfare.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-5 md:p-6 rounded-lg border-2 border-blue-200 hover:shadow-lg transition">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-blue-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                  GD
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">John Estano</h3>
                <p className="text-sm sm:text-base text-blue-600 font-semibold">Lead Developer</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-5 md:p-6 rounded-lg border-2 border-emerald-200 hover:shadow-lg transition">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-emerald-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                  JE
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Geoffrey Diapana</h3>
                <p className="text-sm sm:text-base text-emerald-600 font-semibold">ML Engineer</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-5 md:p-6 rounded-lg border-2 border-purple-200 hover:shadow-lg transition">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-purple-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                  EC
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Earl Coronado</h3>
                <p className="text-sm sm:text-base text-purple-600 font-semibold">Data Scientist</p>
              </div>
            </div>
          </div>
        </section>
          <section className="mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 border-gray-900 pb-2">
            Our Mission
          </h2>
          <p className="text-sm sm:text-base lg:text-lg leading-relaxed mb-3 sm:mb-4  text-gray-700">
           Our mission at Furever.ai is to unite shelter pets with their ideal human companions. Leveraging advanced machine learning, we go beyond typical adoption profiles, delving into the unique personalities and characteristics of both pets and potential owners. Our goal is to create meaningful, lasting connections, ensuring every shelter animal finds a loving home and every owner discovers their perfect Furever friend.
          </p>
        
          
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-10 sm:mb-12 md:mb-16 scroll-mt-20 sm:scroll-mt-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 border-b-2 sm:border-b-4 border-gray-900 pb-1.5 sm:pb-2">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6 sm:space-y-7 md:space-y-8">
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                How accurate is the AI matching system?
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                Our machine learning models have been trained on thousands of successful adoption cases. We continuously refine our algorithms based on adoption outcomes and feedback. While no system is 100% perfect, our multi-algorithm approach provides highly accurate compatibility scores that significantly increase the likelihood of successful, lasting adoptions.
              </p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Is Furever.ai free to use?
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                Yes! For adopters, Furever.ai is completely free. We partner with shelters and rescues who may use our premium tools, but there is never a cost to people looking to adopt a pet. Our mission is to connect pets with loving homes, not to create barriers.
              </p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                What if I don't agree with my Pawsonality Type?
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                The Pawsonality Quiz is just one part of our matching process. You can always browse all available pets and see compatibility scores across the board. Our system is designed to be helpful, not restrictive. If you feel a connection with a pet outside your "type," we encourage you to explore that match!
              </p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                How do I know the pets are really available?
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                We work directly with verified shelters and rescue organizations. Pet profiles are updated in real-time by shelter staff. When you express interest in a pet, you'll be connected directly with the shelter managing that animal's adoption process.
              </p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Can I use Furever.ai if I'm looking for a specific breed?
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                Absolutely! While our AI focuses on personality and lifestyle compatibility, you can filter your search by breed, size, age, and other criteria. Our goal is to help you find the right pet for you, whether that's a specific breed or a perfect mixed-breed companion.
              </p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                How can my shelter partner with Furever.ai?
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                We'd love to work with your shelter! We offer a comprehensive suite of tools designed to streamline adoptions and increase success rates. Contact us at partnerships@pawtech.com to learn more about joining our network of forward-thinking shelters.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 sm:py-10 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
              FurEver.AI
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              Powered by PawTech Inc. • Making perfect matches since 2025
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-gray-600">
            <a href="/about" className="hover:text-blue-600 transition">About</a>
            <a href="#" className="hover:text-blue-600 transition">For Shelters</a>
            <a href="#" className="hover:text-blue-600 transition">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
