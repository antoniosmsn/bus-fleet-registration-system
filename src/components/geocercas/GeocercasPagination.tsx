
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface GeocercasPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const GeocercasPagination: React.FC<GeocercasPaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // If we have few pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Add first page
      pages.push(1);
      
      // Calculate start and end of the window
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(currentPage + 1, totalPages - 1);
      
      // Adjust to show 3 pages in the middle
      if (start === 2) end = Math.min(4, totalPages - 1);
      if (end === totalPages - 1) start = Math.max(end - 2, 2);
      
      // Add ellipsis if needed
      if (start > 2) pages.push(-1); // -1 represents ellipsis
      
      // Add pages in the window
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) pages.push(-2); // -2 represents ellipsis
      
      // Add last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
            href="#"
          />
        </PaginationItem>
        
        {getPageNumbers().map((pageNum, idx) => (
          <PaginationItem key={`page-${idx}`}>
            {pageNum < 0 ? (
              <span className="px-2">...</span>
            ) : (
              <PaginationLink 
                href="#" 
                isActive={pageNum === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(pageNum);
                }}
              >
                {pageNum}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
            href="#"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default GeocercasPagination;
