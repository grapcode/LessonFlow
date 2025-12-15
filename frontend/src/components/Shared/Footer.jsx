import React from 'react';

import { FaFacebook, FaInstagram, FaLinkedin, FaPhone } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import { FaXTwitter } from 'react-icons/fa6';
import LFlogo from '../../assets/LF_logo.jpg';
import MyContainer from '../my-components/MyContainer';

const Footer = () => {
  return (
    <div className="bg-info-content text-white">
      <MyContainer>
        <footer className=" grid md:grid-cols-3 md:justify-items space-x-15 py-10 p-3 gap-5 ">
          <nav>
            <h6 className="footer-title">Company info</h6>
            <div className="flex items-center gap-3 mb-2">
              <img className="w-10" src={LFlogo} alt="" />
              <p className="text-lg">
                Lesson
                <span className="text-accent">Flow</span> Ltd.
              </p>
            </div>

            <p className="text-sm ">
              Lesson Flow — a platform for sharing lessons and learning
              resources.
            </p>
          </nav>

          <nav>
            <h6 className="footer-title">Contact Info</h6>
            <div className="text-[14px]">
              <p>Address: 123, Green Road, Dhaka, Bangladesh</p>
              <p className="flex items-center gap-2 ">
                <FaPhone size={15} /> Phone: +880 1789 123 456
              </p>
              <p className="flex items-center gap-2 ">
                <MdOutlineEmail size={16} /> Email: support@skillswap.com
              </p>
            </div>
          </nav>

          <nav>
            <h6 className="footer-title">Social Links</h6>
            <section className="flex gap-12  text-[14px] ">
              <div className="space-y-2">
                <a className="flex items-center gap-2 font-medium" href="">
                  <FaFacebook /> Facebook
                </a>
                <a className="flex items-center gap-2 font-medium" href="">
                  <FaXTwitter /> Twitter
                </a>
              </div>
              <div className="space-y-2">
                <a className="flex items-center gap-2 font-medium" href="">
                  <FaInstagram /> Instagram
                </a>
                <a className="flex items-center gap-2 font-medium" href="">
                  <FaLinkedin /> LinkedIn
                </a>
              </div>
            </section>
          </nav>
        </footer>
        <p className="text-[12px] text-center my-5">
          © 2025 SharePlate. All rights reserved.
        </p>
      </MyContainer>
    </div>
  );
};

export default Footer;
