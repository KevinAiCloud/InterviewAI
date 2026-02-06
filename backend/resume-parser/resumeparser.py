import fitz  # PyMuPDF
import sys
import logging
from pathlib import Path
from typing import Optional

# Configure logging only if run directly, or let the app configure it.
# We set a logger for this module.
logger = logging.getLogger(__name__)

class ResumeParser:
    """
    A lightweight, modern class to parse text from PDF resumes while preserving layout meaning.
    Uses PyMuPDF (fitz) for high-performance and accurate text extraction.
    """

    def __init__(self):
        pass

    def parse(self, file_path: str) -> Optional[str]:
        """
        Parses the PDF file and returns the extracted text.
        
        Args:
            file_path (str): The path to the PDF file.
            
        Returns:
            str: The extracted text with preserved layout flow.
        """
        path = Path(file_path)
        
        if not path.exists():
            logger.error(f"File not found: {file_path}")
            raise FileNotFoundError(f"File not found: {file_path}")
            
        if path.suffix.lower() != ".pdf":
            logger.error(f"Invalid file type: {path.suffix}. Expected .pdf")
            raise ValueError("Input file must be a PDF.")

        try:
            logger.info(f"Processing file: {file_path}")
            return self._extract_text_from_pdf(path)
        except Exception as e:
            logger.error(f"Failed to parse PDF: {e}")
            raise

    def _extract_text_from_pdf(self, path: Path) -> str:
        """Internal method to extract text using PyMuPDF with layout analysis."""
        doc = fitz.open(path)
        full_text = []

        for page_num, page in enumerate(doc):
            # distinct_text() or get_text("blocks") helps in layout preservation
            # "blocks" returns a list of items: (x0, y0, x1, y1, "lines", block_no, block_type)
            # block_type=0 is text, block_type=1 is image. We filter for text only.
            blocks = page.get_text("blocks")
            
            # Sort blocks by vertical position (y0), then horizontal (x0) to handle columns
            # This is critical for resumes which often have sidebars.
            blocks.sort(key=lambda b: (b[1], b[0]))

            page_text = []
            for block in blocks:
                # blocks structure in pymupdf: (x0, y0, x1, y1, content, block_no, block_type)
                if block[6] == 0:  # block_type 0 is text
                    # The content in 'blocks' output (default) is already a string with newlines
                    text_content = block[4]
                    if text_content.strip():
                        page_text.append(text_content.strip())
            
            if page_text:
                full_text.append("\n".join(page_text))
            
            logger.debug(f"Processed page {page_num + 1}/{len(doc)}")

        doc.close()
        return "\n\n".join(full_text)

if __name__ == "__main__":
    import argparse
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    parser = argparse.ArgumentParser(description="Parse PDF resume to text.")
    parser.add_argument("file_path", help="Path to the PDF file")
    parser.add_argument("-o", "--output", help="Path to save the output text file")
    
    args = parser.parse_args()
    
    resume_parser = ResumeParser()
    try:
        result = resume_parser.parse(args.file_path)
        
        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(result)
            logger.info(f"Successfully saved output to {args.output}")
        else:
            print("-" * 50)
            print("EXTRACTED TEXT:")
            print("-" * 50)
            print(result)
            
    except Exception as e:
        logger.error(f"Error: {e}")
        sys.exit(1)
