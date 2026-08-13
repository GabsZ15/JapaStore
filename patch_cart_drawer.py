import re

with open('src/components/CartDrawer.tsx', 'r') as f:
    content = f.read()

# Imports
import_target = "import { useSettings } from '../contexts/SettingsContext';"
import_replacement = """import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';"""
content = content.replace(import_target, import_replacement)

# State & Effect
state_target = "  const { settings } = useSettings();"
state_replacement = """  const { settings } = useSettings();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      if (user && user.user_metadata?.address) {
        setFormData(user.user_metadata.address);
      } else if (!user) {
        const saved = localStorage.getItem('deliveryAddress');
        if (saved) {
          try {
            setFormData(JSON.parse(saved));
          } catch (e) {}
        }
      } else if (user && !user.user_metadata?.address && user.user_metadata?.full_name) {
        setFormData(prev => ({ ...prev, name: user.user_metadata.full_name }));
      }
    }
  }, [isOpen, user]);
"""
content = content.replace(state_target, state_replacement)

# Save on Review
review_target = """  const goToReview = () => {
    if (validateForm()) {
      setCheckoutStep('review');
    }
  };"""

review_replacement = """  const goToReview = async () => {
    if (validateForm()) {
      if (user) {
        await supabase.auth.updateUser({ data: { address: formData } });
      } else {
        localStorage.setItem('deliveryAddress', JSON.stringify(formData));
      }
      setCheckoutStep('review');
    }
  };"""

content = content.replace(review_target, review_replacement)

with open('src/components/CartDrawer.tsx', 'w') as f:
    f.write(content)

