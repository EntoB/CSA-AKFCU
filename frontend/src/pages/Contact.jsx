import { useState } from 'react';
import {
    FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock,
    FaFacebook, FaTwitter, FaInstagram
} from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will contact you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="w-full font-poppins bg-green-50 text-gray-800 px-4 py-10 mt-10">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-semibold mb-2">Afran Qalloo Farmers' Cooperative Union (AFCU)</h1>
                <p className="text-lg text-gray-600">We'd love to hear from you about how we can serve you better</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 max-w-7xl mx-auto">
                {/* Contact Info */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <h2 className="text-2xl font-semibold mb-4">Our Contact Information</h2>

                    {[
                        { icon: <FaMapMarkerAlt />, title: "Visit Us", details: ["123 Cooperative Lane", "Farmersville, FA 12345"] },
                        { icon: <FaPhone />, title: "Call Us", details: ["Main Office: +251912913222/+251930339798", "Support: (123) 456-7891"] },
                        { icon: <FaEnvelope />, title: "Email Us", details: ["info@farmerscoop.org", "help@farmerscoop.org"] },
                        { icon: <FaClock />, title: "Working Hours", details: ["Mon-Fri: 8am - 5pm", "Sat: 9am - 1pm", "Sun: Closed"] },
                    ].map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="text-green-700 text-xl mt-1">{item.icon}</div>
                            <div>
                                <h3 className="font-semibold">{item.title}</h3>
                                {item.details.map((line, i) => (
                                    <p key={i} className="text-sm text-gray-600">{line}</p>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Social Media */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
                        <div className="flex gap-4 text-green-700 text-xl">
                            <a href="#"><FaFacebook /></a>
                            <a href="#"><FaTwitter /></a>
                            <a href="#"><FaInstagram /></a>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="w-full lg:w-1/2 bg-green-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {[
                            { id: "name", label: "Full Name", type: "text" },
                            { id: "email", label: "Email Address", type: "email" },
                            { id: "subject", label: "Subject", type: "text" },
                        ].map(field => (
                            <div key={field.id}>
                                <label htmlFor={field.id} className="block mb-1 text-sm font-medium">{field.label}</label>
                                <input
                                    type={field.type}
                                    id={field.id}
                                    name={field.id}
                                    value={formData[field.id]}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:outline-none"
                                />
                            </div>
                        ))}

                        <div>
                            <label htmlFor="message" className="block mb-1 text-sm font-medium">Your Message</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:outline-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-6 rounded-md transition duration-200"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>

            {/* Google Map */}
            {/* <div className="mt-16 w-full max-w-7xl mx-auto">
        <iframe
          title="Cooperative Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.0941673905885!2d41.99886177595139!3d9.408076991700566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x16320a943105f41f%3A0x4876b5fc655c9182!2sHaramaya%20University!5e0!3m2!1sen!2set!4v1712853640000!5m2!1sen!2set"
          width="100%"
          height="450"
          className="rounded-lg border-0"
          loading="lazy"
          allowFullScreen
        ></iframe>
      </div> */}
        </div>
    );
};

export default Contact;
