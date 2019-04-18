import { Registration } from '@kloudsoftware/chromstahl-plugin'
import { Component } from '@kloudsoftware/eisen';
import { BlogViewComponent } from './blogcomponent/BlogViewComponent'

export default class RegisterPlugin implements Registration {
    register(): Map<string, Component> {
        const m = new Map<string, Component>();
        m.set("/", new BlogViewComponent());
        return m;
    }
}
