import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">About Solupedia</h1>
          <p className="text-xl text-blue-100">
            Leading the localization industry with expertise, innovation, and a commitment to global communication
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4 text-lg">
                Founded in 2006, Solupedia has been at the forefront of the localization industry for nearly two decades. What started as a small team of passionate language professionals has grown into a comprehensive localization powerhouse serving clients across the globe.
              </p>
              <p className="text-gray-700 mb-4 text-lg">
                Our journey has been defined by a commitment to excellence, innovation, and a deep understanding of the complexities involved in adapting content for different cultures and languages. We've evolved from traditional translation services to offering comprehensive localization solutions that encompass everything from document adaptation to multimedia content creation.
              </p>
              <p className="text-gray-700 text-lg">
                Today, we're proud to have completed over 7,000 projects for more than 200 satisfied clients across diverse industries including technology, healthcare, finance, education, and entertainment.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-8">
              <div className="space-y-6">
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">18+</div>
                  <p className="text-gray-700 font-semibold">Years in Business</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">7,000+</div>
                  <p className="text-gray-700 font-semibold">Projects Completed</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
                  <p className="text-gray-700 font-semibold">Satisfied Clients</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
                  <p className="text-gray-700 font-semibold">Languages Supported</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">What drives us every day</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Heart className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We're committed to delivering the highest quality localization services, with meticulous attention to cultural nuances and linguistic accuracy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Target className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We continuously invest in cutting-edge technology and methodologies to stay ahead of industry trends and serve our clients better.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 text-blue-600 mb-2" />
                <CardTitle>Partnership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We view our clients as partners, working collaboratively to understand their unique needs and deliver solutions that exceed expectations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Expert Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Solupedia comprises a diverse team of specialized professionals dedicated to delivering exceptional localization solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { role: "Localization Engineers", desc: "Technical experts who manage complex localization workflows and ensure seamless integration" },
              { role: "Professional Translators", desc: "Native speakers with subject matter expertise across various industries" },
              { role: "eLearning Specialists", desc: "Experts in adapting educational content for global audiences" },
              { role: "Audio/Video Editors", desc: "Professionals skilled in dubbing, subtitling, and multimedia localization" },
              { role: "Desktop Publishers", desc: "Specialists in formatting and layout for localized documents" },
              { role: "Project Managers", desc: "Experienced coordinators ensuring timely delivery and client satisfaction" },
            ].map((item, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.role}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Partner With Solupedia?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Industry Experience", desc: "Nearly two decades of proven expertise in localization across diverse sectors" },
              { title: "Comprehensive Services", desc: "One-stop solution for all your localization needs, from creation to delivery" },
              { title: "Quality Assurance", desc: "Rigorous QA processes ensuring culturally appropriate and accurate content" },
              { title: "Fast Turnaround", desc: "Efficient workflows enabling quick delivery without compromising quality" },
              { title: "Global Reach", desc: "Support for 150+ languages and deep understanding of cultural nuances" },
              { title: "Client-Centric Approach", desc: "Dedicated support and customized solutions tailored to your specific needs" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-blue-600 mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
