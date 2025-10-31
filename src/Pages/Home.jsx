import { Link } from 'react-router-dom';

const Home = () => {
	return (
		<div className="container">
			<div className="hero" style={{
				minHeight: '70vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				padding: '48px 24px'
			}}>
				<h1 style={{fontSize: '3rem', marginBottom: '24px'}}>
					Welcome to <span className="highlight">Campus Event Hub</span>
				</h1>
				<p style={{fontSize: '1.25rem', maxWidth: '600px', marginBottom: '32px', lineHeight: 1.6}}>
					Discover, register, and manage campus events in one centralized place. Stay connected with all the exciting activities happening on campus!
				</p>
				<div style={{display: 'flex', gap: '16px'}}>
					<Link className="btn btn-primary hero-cta" to="/events">
						Explore Events
					</Link>
					<Link className="btn btn-primary hero-cta" to="/register">
						Register Now
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Home;
