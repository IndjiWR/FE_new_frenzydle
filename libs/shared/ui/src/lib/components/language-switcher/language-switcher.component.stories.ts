import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LanguageSwitcherComponent } from './language-switcher.component';

const meta: Meta<LanguageSwitcherComponent> = {
  title: 'Shared/UI/LanguageSwitcher',
  component: LanguageSwitcherComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        importProvidersFrom(HttpClientTestingModule),
        importProvidersFrom(TranslateModule.forRoot({
          defaultLanguage: 'en',
        })),
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<LanguageSwitcherComponent>;

export const Default: Story = {
  args: {},
};

export const Open: Story = {
  args: {},
};