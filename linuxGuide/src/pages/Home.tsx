import FeatureCard from "../components/ui/FeatureCard";
import "./Home.css";

const Home: React.FC = () => {
  const features = [
    {
      title: "Fast Development",
      description:
        "Leverage React and TypeScript for rapid development with type safety.",
      icon: "⚡",
    },
    {
      title: "Responsive Design",
      description:
        "Create beautiful, responsive layouts that work on any device.",
      icon: "📱",
    },
    {
      title: "Scalable Code",
      description:
        "Write clean, maintainable, and scalable code with best practices.",
      icon: "📈",
    },
  ];

  return (
    <div className="Home">
      <section id="home" className="hero">
        <h1>Welcome to DemoApp</h1>
        <p>Build amazing things with React and TypeScript</p>
        <button className="cta-button">Get Started</button>
      </section>
      <section id="features" className="features">
        <h2>Our Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
};

export default Home;
