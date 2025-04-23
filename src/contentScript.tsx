import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Sidebar } from './components/Sidebar';
import { ToggleButton } from './components/ToggleButton';
import './contentScript.css';

// Wait for an element to be present in the DOM
const waitForElement = (selector: string, container: Document | Element = document, timeout = 15000): Promise<Element> => {
  return new Promise((resolve, reject) => {
    const intervalTime = 500;
    let elapsedTime = 0;
    const interval = setInterval(() => {
      const element = container.querySelector(selector);
      if (element) {
        clearInterval(interval);
        resolve(element);
      }
      elapsedTime += intervalTime;
      if (elapsedTime >= timeout) {
        clearInterval(interval);
        console.warn(`ChatGPT Bookmarks: Element "${selector}" not found within timeout.`);
        reject(new Error(`Element not found: ${selector}`));
      }
    }, intervalTime);
  });
};

// Main content script function
const injectSidebar = async () => {
  try {
    // Create elements to mount React components
    const sidebarRoot = document.createElement('div');
    sidebarRoot.id = 'chatgpt-bookmarks-sidebar-root';
    document.body.appendChild(sidebarRoot);

    // Mount the Sidebar component
    const root = ReactDOM.createRoot(sidebarRoot);
    
    // Create state and toggle function in parent scope to share between components
    let sidebarVisible = false;
    const toggleSidebar = () => {
      sidebarVisible = !sidebarVisible;
      renderComponents();
    };
    
    // Function to render both components with updated state
    const renderComponents = () => {
      root.render(
        <React.StrictMode>
          <Sidebar isVisible={sidebarVisible} onToggle={toggleSidebar} />
        </React.StrictMode>
      );
      
      // Try to inject toggle button if header exists
      injectToggleButton(toggleSidebar);
    };
    
    // Initial render
    renderComponents();
  } catch (error) {
    console.error('ChatGPT Bookmarks: Error injecting sidebar:', error);
  }
};

// Inject toggle button into ChatGPT's header
const injectToggleButton = async (toggleSidebar: () => void) => {
  try {
    // Check if toggle button already exists
    if (document.getElementById('chatgpt-bookmarks-toggle-btn')) {
      return;
    }
    
    // Wait for the specific header element of ChatGPT's *left* sidebar
    const chatGPTSidebarHeader = await waitForElement('#sidebar-header');
    console.log('ChatGPT Bookmarks: Found #sidebar-header.');
    
    // Create container for toggle button
    const toggleButtonContainer = document.createElement('div');
    toggleButtonContainer.id = 'chatgpt-bookmarks-toggle-btn';
    toggleButtonContainer.style.marginLeft = 'auto'; // Push to the right within the header
    
    // Mount the ToggleButton component
    const toggleRoot = ReactDOM.createRoot(toggleButtonContainer);
    toggleRoot.render(
      <React.StrictMode>
        <ToggleButton onClick={toggleSidebar} />
      </React.StrictMode>
    );
    
    // Append the button inside the found header
    chatGPTSidebarHeader.appendChild(toggleButtonContainer);
    console.log('ChatGPT Bookmarks: Toggle button injected into #sidebar-header.');
  } catch (error) {
    console.error('ChatGPT Bookmarks: Error injecting toggle button:', error);
  }
};

// Check if we're on a ChatGPT page
const isChatGPTPage = () => {
  const url = window.location.href;
  return url.includes('chat.openai.com') || url.includes('chatgpt.com');
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (isChatGPTPage()) {
      injectSidebar();
    }
  });
} else {
  if (isChatGPTPage()) {
    injectSidebar();
  }
} 