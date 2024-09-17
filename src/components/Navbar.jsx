"use client";
import { useState, useRef, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MenuIcon, SearchIcon, GraduationCapIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, TrashIcon } from "lucide-react";

// Import data
import { categories } from "@/data/categories";
import { popularCourses } from "@/data/popularCourses";
import { companyLogos } from "@/data/companyLogos";
import { initialImages } from "@/data/initialImages";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCourseMenuOpen, setIsCourseMenuOpen] = useState(false);
  const [desktopCourseMenuOpen, setDesktopCourseMenuOpen] = useState(false);
  const courseButtonRef = useRef(null);
  const courseMenuRef = useRef(null);

  const [images, setImages] = useState(initialImages);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (courseMenuRef.current && !courseMenuRef.current.contains(event.target) &&
          courseButtonRef.current && !courseButtonRef.current.contains(event.target)) {
        setDesktopCourseMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const CourseMenu = ({ isMobile = false }) => (
    <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
      <div>
        <h3 className="font-semibold mb-2">Popular Courses</h3>
        <ul className="space-y-2">
          {popularCourses.map((course, index) => (
            <li key={index}><a href="#" className="text-sm hover:underline">{course}</a></li>
          ))}
        </ul>
      </div>
      <div className={`col-span-2 ${isMobile ? 'mt-4' : ''}`}>
        <h3 className="font-semibold mb-2">Categories</h3>
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
          {categories.map((category, index) => (
            <div key={index}>
              <h4 className="font-medium mb-1">{category.name}</h4>
              <ul className="space-y-1">
                {category.courses.map((course, courseIndex) => (
                  <li key={courseIndex}><a href="#" className="text-sm hover:underline">{course}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const NavItems = ({ isMobile = false }) => (
    <>
      {isMobile ? (
        <div>
          <button 
            onClick={() => setIsCourseMenuOpen(!isCourseMenuOpen)}
            className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium"
          >
            Courses
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${isCourseMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {isCourseMenuOpen && (
            <div className="pl-4 py-2">
              <ScrollArea className="h-[400px] w-full">
                <CourseMenu isMobile />
              </ScrollArea>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <button
            ref={courseButtonRef}
            onClick={() => setDesktopCourseMenuOpen(!desktopCourseMenuOpen)}
            className="flex items-center px-4 py-2 text-sm font-medium"
          >
            Courses <ChevronDownIcon className="ml-1 h-4 w-4" />
          </button>
          {desktopCourseMenuOpen && (
            <div
              ref={courseMenuRef}
              className="absolute left-0 mt-2 w-[600px] bg-white shadow-lg rounded-md overflow-hidden z-50"
            >
              <ScrollArea className="h-[400px]">
                <div className="p-4">
                  <CourseMenu />
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      )}
      <a href="/online-degree" className="flex items-center px-4 py-2 text-sm font-medium">Online Degree</a>
      <a href="/pw-101" className="flex items-center px-4 py-2 text-sm font-medium">PW 101</a>
      <a href="/masterclass" className="flex items-center px-4 py-2 text-sm font-medium">Masterclass</a>
    </>
  );

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const addImage = () => {
    if (newImageUrl) {
      setImages([...images, newImageUrl]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (currentImageIndex >= newImages.length) {
      setCurrentImageIndex(newImages.length - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="mr-2 md:hidden">
              <MenuIcon className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent className="w-[300px] p-0" position="left" size="full">
              <div className="py-4 px-8">
                <NavItems isMobile />
              </div>
            </SheetContent>
          </Sheet>
          <a href="/" className="mr-4 text-xl font-bold">Logo</a>
          <nav className="hidden md:flex items-center space-x-4">
            <NavItems />
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <div className="hidden md:block">
              <Input type="search" placeholder="Search..." className="w-96" />
            </div>
            <Button size="sm" className="hidden md:inline-flex">Login</Button>
            <Button size="sm" className="hidden md:inline-flex">Sign Up</Button>
          </div>
        </div>
      </header>

      <main className="container flex-1 mt-8">
        <div className="relative">
          <Image src={images[currentImageIndex]} alt="Carousel" width={800} height={400} />
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2" onClick={prevImage}>
            <ChevronLeftIcon />
          </button>
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2" onClick={nextImage}>
            <ChevronRightIcon />
          </button>
        </div>
        <div className="mt-4 flex justify-center space-x-2">
          <input type="text" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="Image URL" />
          <button className="bg-blue-500 text-white px-4 py-2" onClick={addImage}>
            <PlusIcon />
          </button>
        </div>
        <ul className="mt-4 flex flex-wrap justify-center space-x-4">
          {images.map((img, index) => (
            <li key={index} className="relative">
              <Image src={img} alt={`Image ${index}`} width={200} height={100} />
              <button className="absolute top-0 right-0 bg-red-500 text-white p-1" onClick={() => removeImage(index)}>
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-center mt-6">
          {companyLogos.map((logo, index) => (
            <Image key={index} src={logo} alt={`Company Logo ${index}`} width={100} height={50} className="mx-2" />
          ))}
        </div>
      </main>
    </div>
  );
}
